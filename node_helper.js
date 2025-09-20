/* Magic Mirror
 * Node Helper: MMM-Crypto
 * 
 * By Marcus
 * Node helper for TradingView cryptocurrency data fetching
 */

const NodeHelper = require("node_helper");
const https = require("https");
const WebSocket = require("ws");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
        this.wsConnections = new Map();
        this.reconnectAttempts = new Map();
        this.maxReconnectAttempts = 5;
    },

    socketNotificationReceived: function(notification, payload) {
        if (notification === "GET_CRYPTO_DATA") {
            if (payload.useWebSocket) {
                this.initWebSocketConnection(payload);
            } else {
                this.getCryptoDataREST(payload);
            }
        } else if (notification === "INIT_WEBSOCKET") {
            this.initWebSocketConnection(payload);
        }
    },

    // Get crypto data using REST API (fallback method)
    getCryptoDataREST: function(config) {
        const self = this;
        const promises = [];

        config.symbols.forEach(symbol => {
            const promise = this.fetchSymbolData(symbol, config.exchange);
            promises.push(promise);
        });

        Promise.all(promises)
            .then(results => {
                const cryptoData = {};
                results.forEach((data, index) => {
                    if (data) {
                        cryptoData[config.symbols[index]] = data;
                    }
                });
                self.sendSocketNotification("CRYPTO_DATA", cryptoData);
            })
            .catch(error => {
                console.error("Error fetching crypto data:", error);
                self.sendSocketNotification("CRYPTO_ERROR", "Failed to fetch data: " + error.message);
            });
    },

    // Fetch individual symbol data
    fetchSymbolData: function(symbol, exchange) {
        return new Promise((resolve, reject) => {
            // Using TradingView's scanner API
            const postData = JSON.stringify({
                "filter": [
                    {"left": "name", "operation": "match", "right": symbol},
                    {"left": "typespecs", "operation": "match", "right": ["crypto"]}
                ],
                "options": {"lang": "en"},
                "symbols": {"query": {"types": []}, "tickers": [`${exchange}:${symbol}`]},
                "columns": ["name", "close", "change", "change_percent", "volume", "high", "low"],
                "sort": {"sortBy": "name", "sortOrder": "asc"},
                "range": [0, 1]
            });

            const options = {
                hostname: 'scanner.tradingview.com',
                port: 443,
                path: '/crypto/scan',
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Content-Length': Buffer.byteLength(postData),
                    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
                }
            };

            const req = https.request(options, (res) => {
                let data = '';

                res.on('data', (chunk) => {
                    data += chunk;
                });

                res.on('end', () => {
                    try {
                        const response = JSON.parse(data);
                        if (response.data && response.data.length > 0) {
                            const symbolData = response.data[0];
                            resolve({
                                price: symbolData.d[1], // close price
                                change: symbolData.d[2], // change
                                change_percent: symbolData.d[3], // change percent
                                volume: symbolData.d[4], // volume
                                high: symbolData.d[5], // high
                                low: symbolData.d[6] // low
                            });
                        } else {
                            resolve(null);
                        }
                    } catch (error) {
                        console.error(`Error parsing data for ${symbol}:`, error);
                        resolve(null);
                    }
                });
            });

            req.on('error', (error) => {
                console.error(`Error fetching ${symbol}:`, error);
                resolve(null);
            });

            req.setTimeout(10000, () => {
                req.abort();
                resolve(null);
            });

            req.write(postData);
            req.end();
        });
    },

    // Initialize WebSocket connection for real-time data
    initWebSocketConnection: function(config) {
        const self = this;
        const wsUrl = 'wss://data.tradingview.com/socket.io/websocket';
        
        try {
            const ws = new WebSocket(wsUrl);
            
            ws.on('open', function() {
                console.log('TradingView WebSocket connected');
                self.sendSocketNotification("WEBSOCKET_CONNECTED", true);
                
                // Send authentication and subscription messages
                self.authenticateAndSubscribe(ws, config);
            });

            ws.on('message', function(data) {
                try {
                    const message = data.toString();
                    self.handleWebSocketMessage(message, config);
                } catch (error) {
                    console.error('Error handling WebSocket message:', error);
                }
            });

            ws.on('close', function() {
                console.log('TradingView WebSocket disconnected');
                self.sendSocketNotification("WEBSOCKET_DISCONNECTED", true);
                
                // Attempt to reconnect
                setTimeout(() => {
                    self.initWebSocketConnection(config);
                }, 5000);
            });

            ws.on('error', function(error) {
                console.error('TradingView WebSocket error:', error);
                self.sendSocketNotification("CRYPTO_ERROR", "WebSocket error: " + error.message);
            });

            this.wsConnections.set('main', ws);
            
        } catch (error) {
            console.error('Failed to create WebSocket connection:', error);
            // Fallback to REST API
            this.getCryptoDataREST(config);
        }
    },

    // Authenticate and subscribe to symbols
    authenticateAndSubscribe: function(ws, config) {
        // TradingView WebSocket protocol messages
        const messages = [
            '~m~52~m~{"m":"set_auth_token","p":["unauthorized_user_token"]}',
            '~m~55~m~{"m":"chart_create_session","p":["cs_1","unauthorized_user_token"]}',
            '~m~47~m~{"m":"quote_create_session","p":["qs_1"]}'
        ];

        messages.forEach(msg => {
            ws.send(msg);
        });

        // Subscribe to each symbol
        config.symbols.forEach((symbol, index) => {
            const fullSymbol = `${config.exchange}:${symbol}`;
            const subscribeMsg = `~m~${JSON.stringify({
                m: "quote_add_symbols",
                p: ["qs_1", fullSymbol, {"flags": ["force_permission"]}]
            }).length + 2}~m~${JSON.stringify({
                m: "quote_add_symbols", 
                p: ["qs_1", fullSymbol, {"flags": ["force_permission"]}]
            })}`;
            
            setTimeout(() => {
                ws.send(subscribeMsg);
            }, 1000 + (index * 200)); // Stagger subscriptions
        });
    },

    // Handle WebSocket messages
    handleWebSocketMessage: function(message, config) {
        try {
            // Parse TradingView's message format
            if (message.includes('quote_completed') || message.includes('qsd')) {
                const parts = message.split('~m~');
                
                parts.forEach(part => {
                    if (part.startsWith('{') && part.includes('qsd')) {
                        try {
                            const data = JSON.parse(part);
                            if (data.m === 'qsd' && data.p && data.p[1]) {
                                const symbolData = data.p[1];
                                const symbol = data.p[0];
                                
                                // Extract symbol name from full symbol (e.g., "BINANCE:BTCUSD" -> "BTCUSD")
                                const cleanSymbol = symbol.split(':')[1];
                                
                                if (config.symbols.includes(cleanSymbol)) {
                                    const processedData = {
                                        lp: symbolData.lp, // last price
                                        ch: symbolData.ch, // change
                                        chp: symbolData.chp, // change percent
                                        volume: symbolData.volume,
                                        high_24h: symbolData.high_24h,
                                        low_24h: symbolData.low_24h
                                    };
                                    
                                    this.sendSocketNotification("REALTIME_DATA", {
                                        symbol: cleanSymbol,
                                        data: processedData
                                    });
                                }
                            }
                        } catch (parseError) {
                            // Ignore parsing errors for non-JSON parts
                        }
                    }
                });
            }
        } catch (error) {
            console.error('Error processing WebSocket message:', error);
        }
    }
});
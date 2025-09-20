/* Magic Mirror
 * Module: MMM-Crypto
 * 
 * By Marcus
 * A cryptocurrency price checker for Magic Mirror using TradingView data
 */

Module.register("MMM-Crypto", {
    // Default module config
    defaults: {
        updateInterval: 30000, // Update every 30 seconds (TradingView allows more frequent updates)
        animationSpeed: 1000,
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD", "SOLUSD", "DOGEUSD"], // TradingView symbols
        exchange: "BINANCE", // Default exchange
        showChange: true,
        showVolume: true,
        showHigh: false,
        showLow: false,
        maxWidth: "450px",
        colored: true,
        showIcon: true,
        showLastUpdate: true,
        decimalPlaces: 2,
        useWebSocket: true, // Use WebSocket for real-time data
        showExchange: false,
        compactMode: false
    },

    // Required version of MagicMirror
    requiresVersion: "2.1.0",

    // Start the module
    start: function() {
        Log.info("Starting module: " + this.name);
        this.cryptoData = {};
        this.loaded = false;
        this.error = null;
        this.lastUpdate = null;
        this.wsConnected = false;
        
        // Schedule the first update
        this.scheduleUpdate();
    },

    // Override dom generator
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "crypto-wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        if (!this.loaded) {
            wrapper.innerHTML = "Loading TradingView data...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (this.error) {
            wrapper.innerHTML = "Error loading crypto data: " + this.error;
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        // Create header
        const header = document.createElement("div");
        header.className = "crypto-header";
        const wsStatus = this.wsConnected ? "🟢" : "🔴";
        header.innerHTML = `<i class='fab fa-bitcoin'></i> Cryptocurrency Prices ${this.config.useWebSocket ? wsStatus : ''}`;
        wrapper.appendChild(header);

        // Create table
        const table = document.createElement("table");
        table.className = "crypto-table small";

        // Create table header
        const headerRow = document.createElement("tr");
        let headerHTML = `
            <th>Symbol</th>
            <th>Price</th>
        `;
        
        if (this.config.showChange) headerHTML += '<th>Change</th>';
        if (this.config.showVolume) headerHTML += '<th>Volume</th>';
        if (this.config.showHigh) headerHTML += '<th>High</th>';
        if (this.config.showLow) headerHTML += '<th>Low</th>';
        if (this.config.showExchange) headerHTML += '<th>Exchange</th>';
        
        headerRow.innerHTML = headerHTML;
        table.appendChild(headerRow);

        // Add crypto data rows
        this.config.symbols.forEach(symbol => {
            if (this.cryptoData[symbol]) {
                const row = this.createCryptoRow(symbol, this.cryptoData[symbol]);
                table.appendChild(row);
            }
        });

        wrapper.appendChild(table);

        // Add last update time
        if (this.config.showLastUpdate && this.lastUpdate) {
            const updateInfo = document.createElement("div");
            updateInfo.className = "crypto-update dimmed xsmall";
            const updateText = this.config.useWebSocket ? "Live data" : "Last updated: " + this.lastUpdate.toLocaleTimeString();
            updateInfo.innerHTML = updateText;
            wrapper.appendChild(updateInfo);
        }

        return wrapper;
    },

    // Create individual crypto row
    createCryptoRow: function(symbol, data) {
        const row = document.createElement("tr");
        row.className = "crypto-row";

        // Symbol name and icon
        const nameCell = document.createElement("td");
        nameCell.className = "crypto-name";
        const coinName = this.getCoinName(symbol);
        const iconUrl = this.getCoinIcon(symbol);
        
        if (this.config.showIcon && iconUrl) {
            nameCell.innerHTML = `<img src="${iconUrl}" class="crypto-icon"> ${this.config.compactMode ? symbol.replace('USD', '') : coinName}`;
        } else {
            nameCell.innerHTML = this.config.compactMode ? symbol.replace('USD', '') : coinName;
        }
        row.appendChild(nameCell);

        // Price
        const priceCell = document.createElement("td");
        priceCell.className = "crypto-price";
        const price = this.formatCurrency(data.price || data.lp);
        priceCell.innerHTML = price;
        row.appendChild(priceCell);

        // Change
        if (this.config.showChange) {
            const changeCell = document.createElement("td");
            changeCell.className = "crypto-change";
            const change = data.change || data.ch;
            const changePercent = data.change_percent || data.chp;
            
            let changeText = "";
            if (changePercent !== undefined) {
                changeText = (changePercent >= 0 ? "+" : "") + changePercent.toFixed(2) + "%";
            } else if (change !== undefined) {
                changeText = (change >= 0 ? "+" : "") + change.toFixed(this.config.decimalPlaces);
            }
            
            if (this.config.colored && changePercent !== undefined) {
                changeCell.className += changePercent >= 0 ? " positive" : " negative";
            }
            changeCell.innerHTML = changeText;
            row.appendChild(changeCell);
        }

        // Volume
        if (this.config.showVolume) {
            const volumeCell = document.createElement("td");
            volumeCell.className = "crypto-volume";
            const volume = data.volume || data.volume_24h;
            volumeCell.innerHTML = volume ? this.formatLargeNumber(volume) : "N/A";
            row.appendChild(volumeCell);
        }

        // High
        if (this.config.showHigh) {
            const highCell = document.createElement("td");
            highCell.className = "crypto-high";
            const high = data.high || data.high_24h;
            highCell.innerHTML = high ? this.formatCurrency(high) : "N/A";
            row.appendChild(highCell);
        }

        // Low
        if (this.config.showLow) {
            const lowCell = document.createElement("td");
            lowCell.className = "crypto-low";
            const low = data.low || data.low_24h;
            lowCell.innerHTML = low ? this.formatCurrency(low) : "N/A";
            row.appendChild(lowCell);
        }

        // Exchange
        if (this.config.showExchange) {
            const exchangeCell = document.createElement("td");
            exchangeCell.className = "crypto-exchange";
            exchangeCell.innerHTML = this.config.exchange;
            row.appendChild(exchangeCell);
        }

        return row;
    },

    // Get coin name from symbol
    getCoinName: function(symbol) {
        const coinNames = {
            "BTCUSD": "Bitcoin",
            "ETHUSD": "Ethereum", 
            "ADAUSD": "Cardano",
            "SOLUSD": "Solana",
            "DOGEUSD": "Dogecoin",
            "BNBUSD": "Binance Coin",
            "XRPUSD": "XRP",
            "MATICUSD": "Polygon",
            "DOTUSD": "Polkadot",
            "AVAXUSD": "Avalanche",
            "LINKUSD": "Chainlink",
            "LTCUSD": "Litecoin",
            "BCHUSD": "Bitcoin Cash",
            "XLMUSD": "Stellar",
            "ATOMUSD": "Cosmos"
        };
        return coinNames[symbol] || symbol.replace('USD', '');
    },

    // Get coin icon URL
    getCoinIcon: function(symbol) {
        const coinIcons = {
            "BTCUSD": "https://cryptologos.cc/logos/bitcoin-btc-logo.png",
            "ETHUSD": "https://cryptologos.cc/logos/ethereum-eth-logo.png",
            "ADAUSD": "https://cryptologos.cc/logos/cardano-ada-logo.png",
            "SOLUSD": "https://cryptologos.cc/logos/solana-sol-logo.png",
            "DOGEUSD": "https://cryptologos.cc/logos/dogecoin-doge-logo.png",
            "BNBUSD": "https://cryptologos.cc/logos/bnb-bnb-logo.png",
            "XRPUSD": "https://cryptologos.cc/logos/xrp-xrp-logo.png",
            "MATICUSD": "https://cryptologos.cc/logos/polygon-matic-logo.png",
            "DOTUSD": "https://cryptologos.cc/logos/polkadot-new-dot-logo.png",
            "AVAXUSD": "https://cryptologos.cc/logos/avalanche-avax-logo.png",
            "LINKUSD": "https://cryptologos.cc/logos/chainlink-link-logo.png",
            "LTCUSD": "https://cryptologos.cc/logos/litecoin-ltc-logo.png",
            "BCHUSD": "https://cryptologos.cc/logos/bitcoin-cash-bch-logo.png",
            "XLMUSD": "https://cryptologos.cc/logos/stellar-xlm-logo.png",
            "ATOMUSD": "https://cryptologos.cc/logos/cosmos-atom-logo.png"
        };
        return coinIcons[symbol];
    },

    // Format currency values
    formatCurrency: function(value) {
        if (!value) return "N/A";
        
        if (value < 0.01) {
            return "$" + value.toFixed(6);
        } else if (value < 1) {
            return "$" + value.toFixed(4);
        } else {
            return "$" + value.toLocaleString(undefined, {
                minimumFractionDigits: this.config.decimalPlaces,
                maximumFractionDigits: this.config.decimalPlaces
            });
        }
    },

    // Format large numbers (volume)
    formatLargeNumber: function(value) {
        if (!value) return "N/A";
        
        if (value >= 1e12) {
            return "$" + (value / 1e12).toFixed(2) + "T";
        } else if (value >= 1e9) {
            return "$" + (value / 1e9).toFixed(2) + "B";
        } else if (value >= 1e6) {
            return "$" + (value / 1e6).toFixed(2) + "M";
        } else if (value >= 1e3) {
            return "$" + (value / 1e3).toFixed(2) + "K";
        } else {
            return "$" + value.toLocaleString();
        }
    },

    // Get styles
    getStyles: function() {
        return ["MMM-Crypto.css", "font-awesome.css"];
    },

    // Schedule next update
    scheduleUpdate: function() {
        const self = this;
        
        if (this.config.useWebSocket) {
            // Initialize WebSocket connection
            this.initWebSocket();
        } else {
            // Use polling for REST API
            setInterval(function() {
                self.updateCryptoData();
            }, this.config.updateInterval);
        }

        // Initial update
        this.updateCryptoData();
    },

    // Initialize WebSocket connection
    initWebSocket: function() {
        this.sendSocketNotification("INIT_WEBSOCKET", {
            symbols: this.config.symbols,
            exchange: this.config.exchange
        });
    },

    // Update crypto data
    updateCryptoData: function() {
        this.sendSocketNotification("GET_CRYPTO_DATA", {
            symbols: this.config.symbols,
            exchange: this.config.exchange,
            useWebSocket: this.config.useWebSocket
        });
    },

    // Handle notifications from node helper
    socketNotificationReceived: function(notification, payload) {
        if (notification === "CRYPTO_DATA") {
            this.cryptoData = payload;
            this.loaded = true;
            this.error = null;
            this.lastUpdate = new Date();
            this.updateDom(this.config.animationSpeed);
        } else if (notification === "CRYPTO_ERROR") {
            this.error = payload;
            this.loaded = true;
            this.updateDom(this.config.animationSpeed);
        } else if (notification === "WEBSOCKET_CONNECTED") {
            this.wsConnected = true;
            this.updateDom(this.config.animationSpeed);
        } else if (notification === "WEBSOCKET_DISCONNECTED") {
            this.wsConnected = false;
            this.updateDom(this.config.animationSpeed);
        } else if (notification === "REALTIME_DATA") {
            // Update specific symbol data
            if (payload.symbol && payload.data) {
                this.cryptoData[payload.symbol] = payload.data;
                this.lastUpdate = new Date();
                this.updateDom(this.config.animationSpeed);
            }
        }
    }
});
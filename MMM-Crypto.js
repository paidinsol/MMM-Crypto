/* Magic Mirror
 * Module: MMM-Crypto
 * 
 * By Marcus
 * A cryptocurrency price checker for Magic Mirror with TradingView-style display
 */

Module.register("MMM-Crypto", {
    // Default module config
    defaults: {
        updateInterval: 60000, // Update every minute
        animationSpeed: 1000,
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD", "SOLUSD", "DOGEUSD"], // TradingView-style symbols
        vs_currency: "usd",
        showChange: true,
        showVolume: true,
        showHigh: false,
        showLow: false,
        showMarketCap: false,
        maxWidth: "450px",
        colored: true,
        showIcon: true,
        showLastUpdate: true,
        decimalPlaces: 2,
        showRank: false,
        compactMode: false,
        showTradingViewWidget: true, // Changed to true by default
        widgetSymbol: "BITSTAMP:BTCUSD", // Default to your symbol
        widgetTheme: "dark",
        // Additional TradingView widget options
        widgetDateRange: "1D", // 1D, 1W, 1M, 3M, 6M, YTD, 1Y, 5Y, ALL
        widgetChartOnly: false,
        widgetNoTimeScale: false,
        widgetIsTransparent: true,
        widgetLocale: "en",
        // NEW: Multiple crypto support and chart control
        widgetType: "mini-symbol-overview", // "mini-symbol-overview", "symbol-overview", "market-quotes"
        multipleSymbols: false, // Enable multiple cryptocurrencies in one widget
        cryptoSymbols: ["BITSTAMP:BTCUSD", "BINANCE:ETHUSD", "BINANCE:SOLUSD"], // Multiple symbols
        showChart: true, // Enable/disable chart display
        widgetHeight: "220" // Height for the widget
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

        // Only schedule updates for legacy mode (table view)
        if (!this.config.showTradingViewWidget) {
            this.scheduleUpdate();
        }
    },

    // Override dom generator
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "crypto-wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        // Show TradingView widget if enabled (recommended mode)
        if (this.config.showTradingViewWidget) {
            return this.createTradingViewWidget();
        }

        // Legacy mode: show loading message for table view
        if (!this.loaded) {
            wrapper.innerHTML = "Loading cryptocurrency data...";
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        if (this.error) {
            wrapper.innerHTML = "Error loading crypto data: " + this.error;
            wrapper.className = "dimmed light small";
            return wrapper;
        }

        // Create header for table view
        const header = document.createElement("div");
        header.className = "crypto-header";
        header.innerHTML = "<i class='fab fa-bitcoin'></i> Cryptocurrency Prices";
        wrapper.appendChild(header);

        // Create table for legacy mode
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
        if (this.config.showMarketCap) headerHTML += '<th>Market Cap</th>';
        if (this.config.showRank) headerHTML += '<th>Rank</th>';
        
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
            const updateDiv = document.createElement("div");
            updateDiv.className = "crypto-update-time";
            updateDiv.innerHTML = "Last updated: " + this.lastUpdate.toLocaleTimeString();
            wrapper.appendChild(updateDiv);
        }

        return wrapper;
    },

    // Create TradingView widget - SIMPLIFIED VERSION
    createTradingViewWidget: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "tradingview-widget-container";
        wrapper.style.maxWidth = this.config.maxWidth;

        // Check if multiple symbols
        if (this.config.multipleSymbols && this.config.cryptoSymbols.length > 1) {
            return this.createMultiSymbolWidget(wrapper);
        } else {
            return this.createSingleSymbolWidget(wrapper);
        }
    },

    // SIMPLIFIED Single Symbol Widget
    createSingleSymbolWidget: function(wrapper) {
        // Create unique ID for this widget
        const widgetId = "tradingview_widget_" + Math.random().toString(36).substr(2, 9);
        
        // Create widget div
        const widgetDiv = document.createElement("div");
        widgetDiv.id = widgetId;
        widgetDiv.style.height = this.config.widgetHeight + "px";
        wrapper.appendChild(widgetDiv);

        // Create copyright
        const copyrightDiv = document.createElement("div");
        copyrightDiv.className = "tradingview-widget-copyright";
        copyrightDiv.innerHTML = '<a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank"><span class="blue-text">Track all markets on TradingView</span></a>';
        wrapper.appendChild(copyrightDiv);

        // Load TradingView widget after DOM is ready
        setTimeout(() => {
            if (typeof TradingView !== 'undefined') {
                new TradingView.widget({
                    "autosize": true,
                    "symbol": this.config.widgetSymbol,
                    "interval": "D",
                    "timezone": "Etc/UTC",
                    "theme": this.config.widgetTheme,
                    "style": "1",
                    "locale": this.config.widgetLocale,
                    "toolbar_bg": "#f1f3f6",
                    "enable_publishing": false,
                    "allow_symbol_change": false,
                    "container_id": widgetId
                });
            } else {
                // Fallback: Load script and create widget
                this.loadTradingViewScript(() => {
                    new TradingView.widget({
                        "autosize": true,
                        "symbol": this.config.widgetSymbol,
                        "interval": "D",
                        "timezone": "Etc/UTC",
                        "theme": this.config.widgetTheme,
                        "style": "1",
                        "locale": this.config.widgetLocale,
                        "toolbar_bg": "#f1f3f6",
                        "enable_publishing": false,
                        "allow_symbol_change": false,
                        "container_id": widgetId
                    });
                });
            }
        }, 100);

        return wrapper;
    },

    // SIMPLIFIED Multi Symbol Widget
    createMultiSymbolWidget: function(wrapper) {
        // Create a simple list of mini widgets
        this.config.cryptoSymbols.forEach((symbol, index) => {
            const miniWrapper = document.createElement("div");
            miniWrapper.className = "crypto-mini-widget";
            miniWrapper.style.marginBottom = "10px";
            
            // Create widget ID
            const widgetId = "tradingview_mini_" + index + "_" + Math.random().toString(36).substr(2, 9);
            
            // Create widget div
            const widgetDiv = document.createElement("div");
            widgetDiv.id = widgetId;
            widgetDiv.style.height = "120px";
            miniWrapper.appendChild(widgetDiv);

            wrapper.appendChild(miniWrapper);

            // Load mini widget
            setTimeout(() => {
                if (typeof TradingView !== 'undefined') {
                    new TradingView.MiniWidget({
                        "symbol": symbol,
                        "width": "100%",
                        "height": "120",
                        "locale": this.config.widgetLocale,
                        "dateRange": this.config.widgetDateRange,
                        "colorTheme": this.config.widgetTheme,
                        "trendLineColor": "rgba(41, 98, 255, 1)",
                        "underLineColor": "rgba(41, 98, 255, 0.3)",
                        "underLineBottomColor": "rgba(41, 98, 255, 0)",
                        "isTransparent": this.config.widgetIsTransparent,
                        "autosize": true,
                        "container_id": widgetId
                    });
                } else {
                    this.loadTradingViewScript(() => {
                        new TradingView.MiniWidget({
                            "symbol": symbol,
                            "width": "100%",
                            "height": "120",
                            "locale": this.config.widgetLocale,
                            "dateRange": this.config.widgetDateRange,
                            "colorTheme": this.config.widgetTheme,
                            "trendLineColor": "rgba(41, 98, 255, 1)",
                            "underLineColor": "rgba(41, 98, 255, 0.3)",
                            "underLineBottomColor": "rgba(41, 98, 255, 0)",
                            "isTransparent": this.config.widgetIsTransparent,
                            "autosize": true,
                            "container_id": widgetId
                        });
                    });
                }
            }, 100 + (index * 50)); // Stagger loading
        });

        return wrapper;
    },

    // Load TradingView script
    loadTradingViewScript: function(callback) {
        if (document.getElementById('tradingview-script')) {
            callback();
            return;
        }

        const script = document.createElement('script');
        script.id = 'tradingview-script';
        script.type = 'text/javascript';
        script.src = 'https://s3.tradingview.com/tv.js';
        script.onload = callback;
        document.head.appendChild(script);
    },

    // Create individual crypto row
    createCryptoRow: function(symbol, data) {
        const row = document.createElement("tr");
        row.className = "crypto-row";

        // Symbol cell with icon
        const symbolCell = document.createElement("td");
        symbolCell.className = "crypto-symbol";
        
        if (this.config.showIcon && data.image) {
            const icon = document.createElement("img");
            icon.src = data.image;
            icon.className = "crypto-icon";
            symbolCell.appendChild(icon);
        }
        
        const symbolSpan = document.createElement("span");
        symbolSpan.className = "crypto-name";
        symbolSpan.textContent = data.name || symbol;
        symbolCell.appendChild(symbolSpan);
        
        row.appendChild(symbolCell);

        // Price cell
        const priceCell = document.createElement("td");
        priceCell.className = "crypto-price";
        priceCell.textContent = this.formatCurrency(data.current_price);
        row.appendChild(priceCell);

        // Change cell
        if (this.config.showChange) {
            const changeCell = document.createElement("td");
            changeCell.className = "crypto-change";
            
            const changePercent = data.price_change_percentage_24h;
            const changeClass = changePercent >= 0 ? "positive" : "negative";
            changeCell.className += " " + changeClass;
            
            const changeText = (changePercent >= 0 ? "+" : "") + changePercent.toFixed(2) + "%";
            changeCell.textContent = changeText;
            
            row.appendChild(changeCell);
        }

        // Volume cell
        if (this.config.showVolume) {
            const volumeCell = document.createElement("td");
            volumeCell.className = "crypto-volume";
            volumeCell.textContent = this.formatLargeNumber(data.total_volume);
            row.appendChild(volumeCell);
        }

        // High cell
        if (this.config.showHigh) {
            const highCell = document.createElement("td");
            highCell.className = "crypto-high";
            highCell.textContent = this.formatCurrency(data.high_24h);
            row.appendChild(highCell);
        }

        // Low cell
        if (this.config.showLow) {
            const lowCell = document.createElement("td");
            lowCell.className = "crypto-low";
            lowCell.textContent = this.formatCurrency(data.low_24h);
            row.appendChild(lowCell);
        }

        // Market cap cell
        if (this.config.showMarketCap) {
            const marketCapCell = document.createElement("td");
            marketCapCell.className = "crypto-market-cap";
            marketCapCell.textContent = this.formatLargeNumber(data.market_cap);
            row.appendChild(marketCapCell);
        }

        // Rank cell
        if (this.config.showRank) {
            const rankCell = document.createElement("td");
            rankCell.className = "crypto-rank";
            rankCell.textContent = "#" + data.market_cap_rank;
            row.appendChild(rankCell);
        }

        return row;
    },

    // Format currency values
    formatCurrency: function(value) {
        if (value === null || value === undefined) return "N/A";
        
        const formatter = new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: this.config.vs_currency.toUpperCase(),
            minimumFractionDigits: this.config.decimalPlaces,
            maximumFractionDigits: this.config.decimalPlaces
        });
        
        return formatter.format(value);
    },

    // Format large numbers (volume, market cap)
    formatLargeNumber: function(value) {
        if (value === null || value === undefined) return "N/A";
        
        if (value >= 1e12) {
            return (value / 1e12).toFixed(2) + "T";
        } else if (value >= 1e9) {
            return (value / 1e9).toFixed(2) + "B";
        } else if (value >= 1e6) {
            return (value / 1e6).toFixed(2) + "M";
        } else if (value >= 1e3) {
            return (value / 1e3).toFixed(2) + "K";
        }
        return value.toFixed(2);
    },

    // Define required styles
    getStyles: function() {
        return ["MMM-Crypto.css"];
    },

    // Schedule next update
    scheduleUpdate: function() {
        setInterval(() => {
            this.updateCryptoData();
        }, this.config.updateInterval);
        
        // Initial update
        this.updateCryptoData();
    },

    // Update crypto data
    updateCryptoData: function() {
        this.sendSocketNotification("GET_CRYPTO_DATA", this.config);
    },

    // Handle notifications from node helper
    socketNotificationReceived: function(notification, payload) {
        if (notification === "CRYPTO_DATA") {
            this.cryptoData = payload.data;
            this.loaded = true;
            this.error = null;
            this.lastUpdate = new Date();
            this.updateDom(this.config.animationSpeed);
        } else if (notification === "CRYPTO_ERROR") {
            this.error = payload.error;
            this.loaded = true;
            this.updateDom(this.config.animationSpeed);
        } else if (notification === "TRADINGVIEW_MODE") {
            // TradingView mode - no server-side data needed
            this.loaded = true;
            this.updateDom(this.config.animationSpeed);
        }
    }
});
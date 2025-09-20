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
        cryptoSymbols: ["BITSTAMP:BTCUSD", "BINANCE:ETHUSD", "BINANCE:ADAUSD"], // Multiple symbols
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
        
        // Schedule the first update only if not using TradingView widget
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

    // Create TradingView widget
    createTradingViewWidget: function() {
        // Create the main container
        const wrapper = document.createElement("div");
        wrapper.className = "tradingview-widget-container";
        wrapper.style.maxWidth = this.config.maxWidth;

        // Determine widget type and configuration
        if (this.config.multipleSymbols && this.config.cryptoSymbols.length > 1) {
            return this.createMultiSymbolWidget(wrapper);
        } else {
            return this.createSingleSymbolWidget(wrapper);
        }
    },

    // Create single symbol widget (mini-symbol-overview)
    createSingleSymbolWidget: function(wrapper) {
        // Create the widget container
        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container__widget";
        wrapper.appendChild(widgetContainer);

        // Create the copyright container
        const copyrightDiv = document.createElement("div");
        copyrightDiv.className = "tradingview-widget-copyright";
        
        const copyrightLink = document.createElement("a");
        copyrightLink.href = "https://www.tradingview.com/symbols/BTCUSD/?exchange=BITSTAMP";
        copyrightLink.rel = "noopener nofollow";
        copyrightLink.target = "_blank";
        
        const bitcoinText = document.createElement("span");
        bitcoinText.className = "blue-text";
        bitcoinText.textContent = "Crypto price";
        copyrightLink.appendChild(bitcoinText);
        
        const trademarkText = document.createElement("span");
        trademarkText.className = "trademark";
        trademarkText.textContent = " by TradingView";
        
        copyrightDiv.appendChild(copyrightLink);
        copyrightDiv.appendChild(trademarkText);
        wrapper.appendChild(copyrightDiv);

        // Create and configure the script
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.async = true;
        
        // Single symbol configuration
        const widgetConfig = {
            "symbol": this.config.widgetSymbol || "BITSTAMP:BTCUSD",
            "chartOnly": !this.config.showChart, // Invert because chartOnly hides other info
            "dateRange": this.config.widgetDateRange || "1D",
            "noTimeScale": this.config.widgetNoTimeScale || false,
            "colorTheme": this.config.widgetTheme || "dark",
            "isTransparent": this.config.widgetIsTransparent || true,
            "locale": this.config.widgetLocale || "en",
            "width": "100%",
            "autosize": true,
            "height": this.config.widgetHeight || "220"
        };
        
        script.innerHTML = JSON.stringify(widgetConfig);
        wrapper.appendChild(script);

        return wrapper;
    },

    // Create multiple symbols widget (symbol-overview or market-quotes)
    createMultiSymbolWidget: function(wrapper) {
        // Create the widget container
        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container__widget";
        wrapper.appendChild(widgetContainer);

        // Create the copyright container
        const copyrightDiv = document.createElement("div");
        copyrightDiv.className = "tradingview-widget-copyright";
        
        const copyrightLink = document.createElement("a");
        copyrightLink.href = "https://www.tradingview.com/";
        copyrightLink.rel = "noopener nofollow";
        copyrightLink.target = "_blank";
        
        const bitcoinText = document.createElement("span");
        bitcoinText.className = "blue-text";
        bitcoinText.textContent = "Crypto prices";
        copyrightLink.appendChild(bitcoinText);
        
        const trademarkText = document.createElement("span");
        trademarkText.className = "trademark";
        trademarkText.textContent = " by TradingView";
        
        copyrightDiv.appendChild(copyrightLink);
        copyrightDiv.appendChild(trademarkText);
        wrapper.appendChild(copyrightDiv);

        // Create and configure the script for multiple symbols
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.async = true;

        let widgetConfig;
        
        if (this.config.showChart) {
            // Use symbol-overview for charts with multiple symbols
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
            
            // Format symbols for symbol-overview widget
            const formattedSymbols = this.config.cryptoSymbols.map(symbol => [
                symbol.split(':')[1] || symbol, // Display name
                symbol // Full symbol
            ]);

            widgetConfig = {
                "symbols": formattedSymbols,
                "chartOnly": false,
                "width": "100%",
                "height": this.config.widgetHeight || "400",
                "locale": this.config.widgetLocale || "en",
                "colorTheme": this.config.widgetTheme || "dark",
                "autosize": true,
                "showVolume": false,
                "showMA": false,
                "hideDateRanges": false,
                "hideMarketStatus": false,
                "hideSymbolLogo": false,
                "scalePosition": "right",
                "scaleMode": "Normal",
                "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
                "fontSize": "10",
                "noTimeScale": this.config.widgetNoTimeScale || false,
                "valuesTracking": "1",
                "changeMode": "price-and-percent",
                "chartType": "area"
            };
        } else {
            // Use market-quotes for price-only display
            script.src = "https://s3.tradingview.com/external-embedding/embed-widget-market-quotes.js";
            
            widgetConfig = {
                "width": "100%",
                "height": this.config.widgetHeight || "300",
                "symbolsGroups": [
                    {
                        "name": "Cryptocurrencies",
                        "symbols": this.config.cryptoSymbols.map(symbol => ({
                            "name": symbol
                        }))
                    }
                ],
                "showSymbolLogo": true,
                "colorTheme": this.config.widgetTheme || "dark",
                "isTransparent": this.config.widgetIsTransparent || true,
                "locale": this.config.widgetLocale || "en"
            };
        }
        
        script.innerHTML = JSON.stringify(widgetConfig);
        wrapper.appendChild(script);

        return wrapper;
    },

    // Create individual crypto row
    createCryptoRow: function(symbol, data) {
        const row = document.createElement("tr");
        row.className = "crypto-row";

        // Name/Symbol cell
        const nameCell = document.createElement("td");
        nameCell.className = "crypto-name";
        const coinName = data.name;

        if (this.config.showIcon && data.image) {
            nameCell.innerHTML = `<img src="${data.image}" class="crypto-icon"> ${this.config.compactMode ? data.symbol : coinName}`;
        } else {
            nameCell.innerHTML = this.config.compactMode ? data.symbol : coinName;
        }
        row.appendChild(nameCell);

        // Price cell
        const priceCell = document.createElement("td");
        priceCell.className = "crypto-price";
        const price = this.formatCurrency(data.price);
        priceCell.innerHTML = price;
        row.appendChild(priceCell);

        // Change cell
        if (this.config.showChange) {
            const changeCell = document.createElement("td");
            changeCell.className = "crypto-change";
            const changePercent = data.change_percent;
            
            let changeText = "";
            if (changePercent !== undefined) {
                changeText = (changePercent >= 0 ? "+" : "") + changePercent.toFixed(2) + "%";
            }
            
            if (this.config.colored && changePercent !== undefined) {
                changeCell.className += changePercent >= 0 ? " positive" : " negative";
            }
            changeCell.innerHTML = changeText;
            row.appendChild(changeCell);
        }

        // Volume cell
        if (this.config.showVolume) {
            const volumeCell = document.createElement("td");
            volumeCell.className = "crypto-volume";
            volumeCell.innerHTML = data.volume ? this.formatLargeNumber(data.volume) : "N/A";
            row.appendChild(volumeCell);
        }

        // High cell
        if (this.config.showHigh) {
            const highCell = document.createElement("td");
            highCell.className = "crypto-high";
            highCell.innerHTML = data.high_24h ? this.formatCurrency(data.high_24h) : "N/A";
            row.appendChild(highCell);
        }

        // Low cell
        if (this.config.showLow) {
            const lowCell = document.createElement("td");
            lowCell.className = "crypto-low";
            lowCell.innerHTML = data.low_24h ? this.formatCurrency(data.low_24h) : "N/A";
            row.appendChild(lowCell);
        }

        // Market cap cell
        if (this.config.showMarketCap) {
            const mcapCell = document.createElement("td");
            mcapCell.className = "crypto-mcap";
            mcapCell.innerHTML = data.market_cap ? this.formatLargeNumber(data.market_cap) : "N/A";
            row.appendChild(mcapCell);
        }

        // Rank cell
        if (this.config.showRank) {
            const rankCell = document.createElement("td");
            rankCell.className = "crypto-rank";
            rankCell.innerHTML = data.market_cap_rank ? "#" + data.market_cap_rank : "N/A";
            row.appendChild(rankCell);
        }

        return row;
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

    // Format large numbers
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

    // Get additional CSS files
    getStyles: function() {
        return ["MMM-Crypto.css", "font-awesome.css"];
    },

    // Schedule next update
    scheduleUpdate: function() {
        const self = this;
        setInterval(function() {
            self.updateCryptoData();
        }, this.config.updateInterval);

        // Initial update
        this.updateCryptoData();
    },

    // Update crypto data
    updateCryptoData: function() {
        this.sendSocketNotification("GET_CRYPTO_DATA", {
            symbols: this.config.symbols,
            vs_currency: this.config.vs_currency
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
        } else if (notification === "TRADINGVIEW_MODE") {
            // TradingView mode - no action needed
            Log.info("MMM-Crypto: " + payload.message);
        }
    }
});
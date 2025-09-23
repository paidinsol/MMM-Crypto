/* Magic Mirror
 * Module: MMM-Crypto
 * 
 * By Marcus
 * A cryptocurrency price checker for Magic Mirror with TradingView advanced chart widget
 */

Module.register("MMM-Crypto", {
    // Default module config
    defaults: {
        showTradingViewWidget: true,
        widgetTheme: "dark",
        maxWidth: "100%",
        height: "600px",
        symbols: [
            ["BINANCE:BTCUSD", "Bitcoin"],
            ["BINANCE:SOLUSD", "Solana"],
            ["OANDA:XAUUSD", "Gold"],
            ["BINANCE:DOGEUSD", "Dogecoin"]
        ]
    },

    // Required version of MagicMirror
    requiresVersion: "2.1.0",

    // Start the module
    start: function() {
        Log.info("Starting module: " + this.name);
    },

    // Override dom generator
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.style.width = this.config.maxWidth;
        wrapper.style.height = this.config.height;
        wrapper.style.minHeight = "500px";

        // Create the TradingView widget container
        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container";
        widgetContainer.style.height = "100%";
        widgetContainer.style.width = "100%";

        // Create the widget div
        const widgetDiv = document.createElement("div");
        widgetDiv.className = "tradingview-widget-container__widget";
        widgetDiv.style.height = "calc(100% - 32px)";
        widgetDiv.style.width = "100%";
        widgetContainer.appendChild(widgetDiv);

        // Create the copyright div
        const copyrightDiv = document.createElement("div");
        copyrightDiv.className = "tradingview-widget-copyright";
        copyrightDiv.style.fontSize = "13px";
        copyrightDiv.style.lineHeight = "32px";
        copyrightDiv.style.textAlign = "center";
        copyrightDiv.style.verticalAlign = "middle";
        copyrightDiv.style.fontFamily = "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif";
        copyrightDiv.style.color = "#9db2bd";
        
        const copyrightLink = document.createElement("a");
        copyrightLink.href = "https://www.tradingview.com/markets/";
        copyrightLink.rel = "noopener nofollow";
        copyrightLink.target = "_blank";
        copyrightLink.style.color = "#9db2bd";
        copyrightLink.style.textDecoration = "none";
        copyrightLink.style.fontSize = "13px";
        
        const linkSpan = document.createElement("span");
        linkSpan.className = "blue-text";
        linkSpan.textContent = "World markets";
        linkSpan.style.color = "#2962FF";
        copyrightLink.appendChild(linkSpan);
        
        const trademarkText = document.createTextNode(" by TradingView");
        
        copyrightDiv.appendChild(copyrightLink);
        copyrightDiv.appendChild(trademarkText);
        widgetContainer.appendChild(copyrightDiv);

        // Create and configure the script element for SYMBOL OVERVIEW (supports multiple symbols)
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
        script.async = true;
        
        // Multi-symbol configuration with advanced chart features
        const config = {
            "symbols": this.config.symbols,
            "chartOnly": false,
            "width": "100%",
            "height": "100%",
            "locale": "en",
            "colorTheme": this.config.widgetTheme,
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
            "noTimeScale": false,
            "valuesTracking": "1",
            "changeMode": "price-and-percent",
            "chartType": "area",
            "maLineColor": "#2962FF",
            "maLineWidth": 1,
            "maLength": 9,
            "lineWidth": 2,
            "lineType": 0,
            "dateRanges": [
                "1d|1",
                "1m|30",
                "3m|60",
                "12m|1D",
                "60m|1W",
                "all|1M"
            ]
        };
        
        script.textContent = JSON.stringify(config);
        widgetContainer.appendChild(script);

        wrapper.appendChild(widgetContainer);
        return wrapper;
    },

    // Define required styles
    getStyles: function() {
        return ["MMM-Crypto.css"];
    }
});
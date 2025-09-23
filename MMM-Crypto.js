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
        height: "450px", // Reduced from 600px to 450px
        symbols: [
            ["BINANCE:BTCUSD|1M"],
            ["BINANCE:SOLUSD|1M"],
            ["OANDA:XAUUSD|1M"],
            ["BINANCE:DOGEUSD|1M"]
        ]
    },

    // Required version of MagicMirror
    requiresVersion: "2.1.0",

    // Start the module
    start: function() {
        Log.info("Starting module: " + this.name);
        this.loaded = false;
    },

    // Override dom generator
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.style.width = this.config.maxWidth;
        wrapper.style.height = this.config.height;
        wrapper.style.minHeight = "400px"; // Reduced minimum height
        wrapper.style.position = "relative";

        // Create the TradingView widget container
        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container";
        widgetContainer.style.height = "100%";
        widgetContainer.style.width = "100%";
        widgetContainer.style.opacity = this.loaded ? "1" : "0";
        widgetContainer.style.transition = "opacity 0.3s ease";

        // Create the widget div
        const widgetDiv = document.createElement("div");
        widgetDiv.className = "tradingview-widget-container__widget";
        widgetDiv.style.height = "calc(100% - 32px)";
        widgetDiv.style.width = "100%";
        widgetContainer.appendChild(widgetDiv);

        // Create the copyright div
        const copyrightDiv = document.createElement("div");
        copyrightDiv.className = "tradingview-widget-copyright";
        copyrightDiv.style.fontSize = "12px"; // Slightly smaller font
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
        copyrightLink.style.fontSize = "12px";
        
        const linkSpan = document.createElement("span");
        linkSpan.className = "blue-text";
        linkSpan.textContent = "World markets";
        linkSpan.style.color = "#2962FF";
        copyrightLink.appendChild(linkSpan);
        
        const trademarkText = document.createTextNode(" by TradingView");
        
        copyrightDiv.appendChild(copyrightLink);
        copyrightDiv.appendChild(trademarkText);
        widgetContainer.appendChild(copyrightDiv);

        // Create script element with proper configuration
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js";
        script.async = true;
        
        // Configuration object
        const config = {
            "lineWidth": 2,
            "lineType": 0,
            "chartType": "candlesticks",
            "showVolume": true,
            "fontColor": "rgb(106, 109, 120)",
            "gridLineColor": "rgba(242, 242, 242, 0.06)",
            "volumeUpColor": "rgba(34, 171, 148, 0.5)",
            "volumeDownColor": "rgba(247, 82, 95, 0.5)",
            "backgroundColor": "rgba(200, 230, 201, 0)",
            "widgetFontColor": "#DBDBDB",
            "upColor": "rgba(255, 255, 255, 0)",
            "downColor": "rgba(99, 99, 99, 1)",
            "borderUpColor": "rgba(255, 255, 255, 1)",
            "borderDownColor": "rgba(15, 15, 15, 0)",
            "wickUpColor": "rgba(255, 255, 255, 1)",
            "wickDownColor": "rgba(255, 255, 255, 1)",
            "colorTheme": this.config.widgetTheme,
            "isTransparent": false,
            "locale": "en",
            "chartOnly": false,
            "scalePosition": "right",
            "scaleMode": "Normal",
            "fontFamily": "-apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif",
            "valuesTracking": "1",
            "changeMode": "price-and-percent",
            "symbols": this.config.symbols,
            "dateRanges": [
                "1m|240",
                "3m|1D",
                "6m|1D"
            ],
            "fontSize": "10",
            "headerFontSize": "medium",
            "autosize": true,
            "dateFormat": "dd/MM/yyyy",
            "width": "100%",
            "height": "100%",
            "noTimeScale": false,
            "hideDateRanges": false,
            "compareSymbol": {
                "symbol": "TVC:DXY",
                "lineColor": "rgba(242, 54, 69, 1)",
                "lineWidth": 2,
                "showLabels": true
            },
            "hideMarketStatus": false,
            "hideSymbolLogo": false
        };
        
        // CRITICAL FIX: Set the configuration as a data attribute instead of textContent
        script.setAttribute('data-tradingview-config', JSON.stringify(config));
        
        // Alternative method: Create a separate script tag with the config
        const configScript = document.createElement("script");
        configScript.type = "text/javascript";
        configScript.textContent = `
            window.tradingViewConfig = ${JSON.stringify(config)};
        `;
        
        // Append both scripts
        widgetContainer.appendChild(configScript);
        widgetContainer.appendChild(script);

        wrapper.appendChild(widgetContainer);
        return wrapper;
    },

    // Define required styles
    getStyles: function() {
        return ["MMM-Crypto.css"];
    }
});
/* Magic Mirror
 * Module: MMM-Crypto
 * 
 * By Marcus
 * A cryptocurrency price checker for Magic Mirror with TradingView widget
 */

Module.register("MMM-Crypto", {
    // Default module config
    defaults: {
        showTradingViewWidget: true,
        widgetSymbol: "BITSTAMP:BTCUSD",
        widgetTheme: "dark",
        maxWidth: "450px"
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
        wrapper.style.maxWidth = this.config.maxWidth;

        // Create the TradingView widget container
        const widgetContainer = document.createElement("div");
        widgetContainer.className = "tradingview-widget-container";

        // Create the widget div
        const widgetDiv = document.createElement("div");
        widgetDiv.className = "tradingview-widget-container__widget";
        widgetContainer.appendChild(widgetDiv);

        // Create the copyright div
        const copyrightDiv = document.createElement("div");
        copyrightDiv.className = "tradingview-widget-copyright";
        
        const copyrightLink = document.createElement("a");
        copyrightLink.href = "https://www.tradingview.com/symbols/BTCUSD/?exchange=BITSTAMP";
        copyrightLink.rel = "noopener nofollow";
        copyrightLink.target = "_blank";
        
        const linkSpan = document.createElement("span");
        linkSpan.className = "blue-text";
        linkSpan.textContent = "Bitcoin price";
        copyrightLink.appendChild(linkSpan);
        
        const trademarkSpan = document.createElement("span");
        trademarkSpan.className = "trademark";
        trademarkSpan.textContent = " by TradingView";
        
        copyrightDiv.appendChild(copyrightLink);
        copyrightDiv.appendChild(trademarkSpan);
        widgetContainer.appendChild(copyrightDiv);

        // Create and configure the script element
        const script = document.createElement("script");
        script.type = "text/javascript";
        script.src = "https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js";
        script.async = true;
        
        // Set the widget configuration
        const config = {
            "symbol": this.config.widgetSymbol,
            "chartOnly": false,
            "dateRange": "1D",
            "noTimeScale": false,
            "colorTheme": this.config.widgetTheme,
            "isTransparent": true,
            "locale": "en",
            "width": "100%",
            "autosize": true,
            "height": "100%"
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
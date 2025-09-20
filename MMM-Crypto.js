/* Magic Mirror
 * Module: MMM-Crypto
 * 
 * By Marcus
 * A cryptocurrency price checker for Magic Mirror with TradingView-style display
 */

Module.register("MMM-Crypto", {
    // Default module config
    defaults: {
        showTradingViewWidget: true,
        widgetSymbol: "BITSTAMP:BTCUSD",
        widgetTheme: "dark",
        maxWidth: "450px",
        widgetHeight: "220"
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
        wrapper.className = "crypto-wrapper";
        wrapper.style.maxWidth = this.config.maxWidth;

        // Show TradingView widget
        if (this.config.showTradingViewWidget) {
            return this.createSimpleWidget();
        }

        // Fallback message
        wrapper.innerHTML = "TradingView widget disabled";
        wrapper.className = "dimmed light small";
        return wrapper;
    },

    // Create the simplest possible TradingView widget
    createSimpleWidget: function() {
        const container = document.createElement("div");
        container.className = "tradingview-widget-container";
        container.style.maxWidth = this.config.maxWidth;
        
        // Create widget HTML directly
        const widgetHTML = `
            <!-- TradingView Widget BEGIN -->
            <div class="tradingview-widget-container__widget"></div>
            <div class="tradingview-widget-copyright">
                <a href="https://www.tradingview.com/" rel="noopener nofollow" target="_blank">
                    <span class="blue-text">Track all markets on TradingView</span>
                </a>
            </div>
            <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
            {
                "symbol": "${this.config.widgetSymbol}",
                "width": "100%",
                "height": "${this.config.widgetHeight}",
                "locale": "en",
                "dateRange": "1D",
                "colorTheme": "${this.config.widgetTheme}",
                "trendLineColor": "rgba(41, 98, 255, 1)",
                "underLineColor": "rgba(41, 98, 255, 0.3)",
                "underLineBottomColor": "rgba(41, 98, 255, 0)",
                "isTransparent": true,
                "autosize": true,
                "largeChartUrl": ""
            }
            </script>
            <!-- TradingView Widget END -->
        `;
        
        container.innerHTML = widgetHTML;
        return container;
    },

    // Define required styles
    getStyles: function() {
        return ["MMM-Crypto.css"];
    }
});
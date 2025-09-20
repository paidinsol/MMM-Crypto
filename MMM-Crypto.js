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

        // Use the exact TradingView widget HTML you provided
        wrapper.innerHTML = `
            <!-- TradingView Widget BEGIN -->
            <div class="tradingview-widget-container">
                <div class="tradingview-widget-container__widget"></div>
                <div class="tradingview-widget-copyright">
                    <a href="https://www.tradingview.com/symbols/BTCUSD/?exchange=BITSTAMP" rel="noopener nofollow" target="_blank">
                        <span class="blue-text">Bitcoin price</span>
                    </a>
                    <span class="trademark"> by TradingView</span>
                </div>
                <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-mini-symbol-overview.js" async>
                {
                    "symbol": "${this.config.widgetSymbol}",
                    "chartOnly": false,
                    "dateRange": "1D",
                    "noTimeScale": false,
                    "colorTheme": "${this.config.widgetTheme}",
                    "isTransparent": true,
                    "locale": "en",
                    "width": "100%",
                    "autosize": true,
                    "height": "100%"
                }
                </script>
            </div>
            <!-- TradingView Widget END -->
        `;

        return wrapper;
    },

    // Define required styles
    getStyles: function() {
        return ["MMM-Crypto.css"];
    }
});
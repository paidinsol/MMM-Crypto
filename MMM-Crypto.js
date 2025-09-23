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
        height: "450px",
        autoSwitchInterval: 40000, // 40 seconds in milliseconds
        symbols: [
            ["BINANCE:BTCUSD|1M"],
            ["BINANCE:SOLUSD|1M"],
            ["INDEX:ETHUSD|1M"],
            ["CAPITALCOM:DXY|1M"]
        ]
    },

    // Required version of MagicMirror
    requiresVersion: "2.1.0",

    // Start the module
    start: function() {
        Log.info("Starting module: " + this.name);
        this.currentSymbolIndex = 0;
        this.autoSwitchTimer = null;
        this.startAutoSwitch();
    },

    // Override dom generator
    getDom: function() {
        const wrapper = document.createElement("div");
        wrapper.className = "mmm-crypto-wrapper";
        wrapper.style.width = this.config.maxWidth;
        wrapper.style.height = this.config.height;
        wrapper.style.minHeight = "400px";

        this.updateWidget(wrapper);
        return wrapper;
    },

    updateWidget: function(container) {
        // Get current symbol
        const currentSymbol = this.config.symbols[this.currentSymbolIndex];
        
        // Clear existing content
        container.innerHTML = '';

        // Create the widget configuration with current symbol
        const widgetConfig = {
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
            "symbols": [currentSymbol], // Only show current symbol
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
                "showLabels": false
            },
            "hideMarketStatus": false,
            "hideSymbolLogo": false
        };

        // Use the exact HTML structure you provided
        container.innerHTML = `
            <div class="tradingview-widget-container" style="height: 100%; width: 100%;">
                <div class="tradingview-widget-container__widget" style="height: calc(100% - 32px); width: 100%;"></div>
                <div class="tradingview-widget-copyright" style="font-size: 12px; line-height: 32px; text-align: center; vertical-align: middle; font-family: -apple-system, BlinkMacSystemFont, Trebuchet MS, Roboto, Ubuntu, sans-serif; color: #9db2bd;">
                    <a href="https://www.tradingview.com/markets/" rel="noopener nofollow" target="_blank" style="color: #9db2bd; text-decoration: none; font-size: 12px;">
                        <span class="blue-text" style="color: #2962FF;">World markets</span>
                    </a> by TradingView
                </div>
                <script type="text/javascript" src="https://s3.tradingview.com/external-embedding/embed-widget-symbol-overview.js" async>
                ${JSON.stringify(widgetConfig)}
                </script>
            </div>
        `;

        // Execute the script manually to ensure it loads
        setTimeout(() => {
            const scripts = container.querySelectorAll('script');
            scripts.forEach(script => {
                const newScript = document.createElement('script');
                newScript.src = script.src;
                newScript.async = script.async;
                newScript.textContent = script.textContent;
                script.parentNode.replaceChild(newScript, script);
            });
        }, 100);
    },

    startAutoSwitch: function() {
        // Clear any existing timer
        if (this.autoSwitchTimer) {
            clearInterval(this.autoSwitchTimer);
        }

        // Set up auto-switching every 40 seconds
        this.autoSwitchTimer = setInterval(() => {
            this.switchToNextSymbol();
        }, this.config.autoSwitchInterval);
    },

    switchToNextSymbol: function() {
        // Move to next symbol (cycle through the array)
        this.currentSymbolIndex = (this.currentSymbolIndex + 1) % this.config.symbols.length;
        
        // Update the DOM
        this.updateDom();
        
        Log.info(`MMM-Crypto: Switched to symbol ${this.config.symbols[this.currentSymbolIndex][0]}`);
    },

    suspend: function() {
        // Clear timer when module is suspended
        if (this.autoSwitchTimer) {
            clearInterval(this.autoSwitchTimer);
            this.autoSwitchTimer = null;
        }
    },

    resume: function() {
        // Restart timer when module is resumed
        this.startAutoSwitch();
    },

    // Define required styles
    getStyles: function() {
        return ["MMM-Crypto.css"];
    }
});
/* Magic Mirror
 * Node Helper: MMM-Crypto
 * 
 * By Marcus
 * Simplified node helper for TradingView widget integration
 */

const NodeHelper = require("node_helper");

module.exports = NodeHelper.create({
    start: function() {
        console.log("Starting node helper for: " + this.name);
        console.log("MMM-Crypto: Using TradingView widgets - no API calls needed");
    },

    socketNotificationReceived: function(notification, payload) {
        // When using TradingView widgets, we don't need to handle any data requests
        // The widgets handle their own data fetching directly from TradingView
        
        if (notification === "GET_CRYPTO_DATA") {
            // Send back a message indicating we're using TradingView widgets
            this.sendSocketNotification("TRADINGVIEW_MODE", {
                message: "Using TradingView widgets - no server-side data fetching required"
            });
        }
    }
});
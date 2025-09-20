/* TradingView Configuration Examples for MMM-Crypto
 * Copy and paste these configurations into your MagicMirror config/config.js file
 * within the modules array
 */

// Example 1: Basic TradingView configuration with WebSocket
const basicConfig = {
    module: "MMM-Crypto",
    position: "top_right",
    config: {
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD"],
        exchange: "BINANCE",
        updateInterval: 30000, // 30 seconds
        useWebSocket: true, // Real-time data
        showChange: true,
        colored: true
    }
};

// Example 2: Advanced configuration with all TradingView features
const advancedConfig = {
    module: "MMM-Crypto",
    position: "top_right",
    config: {
        symbols: [
            "BTCUSD",    // Bitcoin
            "ETHUSD",    // Ethereum
            "ADAUSD",    // Cardano
            "SOLUSD",    // Solana
            "BNBUSD",    // Binance Coin
            "XRPUSD",    // XRP
            "MATICUSD",  // Polygon
            "DOTUSD",    // Polkadot
            "AVAXUSD",   // Avalanche
            "LINKUSD"    // Chainlink
        ],
        exchange: "BINANCE", // BINANCE, COINBASE, KRAKEN, BITFINEX, etc.
        updateInterval: 15000, // 15 seconds for REST API fallback
        useWebSocket: true, // Enable real-time WebSocket data
        showChange: true,
        showVolume: true,
        showHigh: true,
        showLow: true,
        showExchange: false,
        maxWidth: "500px",
        colored: true,
        showIcon: true,
        showLastUpdate: true,
        decimalPlaces: 2,
        compactMode: false
    }
};

// Example 3: Compact mode for smaller displays
const compactConfig = {
    module: "MMM-Crypto",
    position: "bottom_right",
    config: {
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD", "SOLUSD"],
        exchange: "BINANCE",
        useWebSocket: true,
        showChange: true,
        showVolume: false,
        showHigh: false,
        showLow: false,
        compactMode: true,
        maxWidth: "300px",
        colored: true,
        showIcon: true,
        showLastUpdate: false
    }
};

// Example 4: Coinbase exchange configuration
const coinbaseConfig = {
    module: "MMM-Crypto",
    position: "top_left",
    config: {
        symbols: ["BTCUSD", "ETHUSD"],
        exchange: "COINBASE", // Coinbase Pro data
        useWebSocket: false, // Use REST API only
        updateInterval: 60000, // 1 minute
        showExchange: true
    }
};

// Example 5: Kraken exchange configuration
const krakenConfig = {
    module: "MMM-Crypto", 
    position: "middle_center",
    config: {
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD"],
        exchange: "KRAKEN",
        useWebSocket: true,
        showVolume: true,
        showHigh: true,
        showLow: true
    }
};

/* 
 * HOW TO USE THESE CONFIGURATIONS:
 * 
 * 1. Open your MagicMirror config/config.js file
 * 2. Find the modules array
 * 3. Copy one of the configurations above (without the const name =)
 * 4. Paste it into your modules array
 * 
 * Example:
 * 
 * modules: [
 *     {
 *         module: "alert",
 *     },
 *     {
 *         module: "MMM-Crypto",
 *         position: "top_right",
 *         config: {
 *             symbols: ["BTCUSD", "ETHUSD", "ADAUSD"],
 *             exchange: "BINANCE",
 *             useWebSocket: true,
 *             showChange: true,
 *             colored: true
 *         }
 *     },
 *     // ... other modules
 * ]
 */

// Export configurations for potential programmatic use
module.exports = {
    basicConfig,
    advancedConfig,
    compactConfig,
    coinbaseConfig,
    krakenConfig
};

/* 
 * POPULAR TRADINGVIEW SYMBOLS BY EXCHANGE:
 * 
 * BINANCE:
 * - BTCUSD, ETHUSD, ADAUSD, SOLUSD, BNBUSD, XRPUSD, DOGEUSD
 * - MATICUSD, DOTUSD, AVAXUSD, LINKUSD, LTCUSD, BCHUSD, XLMUSD
 * 
 * COINBASE:
 * - BTCUSD, ETHUSD, ADAUSD, SOLUSD, LINKUSD, LTCUSD, BCHUSD
 * - MATICUSD, DOTUSD, AVAXUSD, XLMUSD, ATOMUSD
 * 
 * KRAKEN:
 * - BTCUSD, ETHUSD, ADAUSD, SOLUSD, LINKUSD, LTCUSD, BCHUSD
 * - DOTUSD, AVAXUSD, XLMUSD, ATOMUSD
 * 
 * BITFINEX:
 * - BTCUSD, ETHUSD, ADAUSD, SOLUSD, LINKUSD, LTCUSD, BCHUSD
 * - MATICUSD, DOTUSD, AVAXUSD, XLMUSD
 */
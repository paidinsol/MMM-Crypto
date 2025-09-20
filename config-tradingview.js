/* Configuration Examples for MMM-Crypto
 * Copy and paste these configurations into your MagicMirror config/config.js file
 * within the modules array
 */

// Example 1: Basic configuration with TradingView-style symbols
const basicConfig = {
    module: "MMM-Crypto",
    position: "top_right",
    config: {
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD"],
        updateInterval: 60000, // 1 minute
        showChange: true,
        colored: true,
        showIcon: true
    }
};

// Example 2: Advanced configuration with all features
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
        updateInterval: 60000, // 1 minute
        showChange: true,
        showVolume: true,
        showHigh: true,
        showLow: true,
        showMarketCap: true,
        showRank: true,
        maxWidth: "500px",
        colored: true,
        showIcon: true,
        showLastUpdate: true,
        decimalPlaces: 2,
        compactMode: false
    }
};

// Example 3: TradingView Widget Configuration (RECOMMENDED)
const tradingViewWidgetConfig = {
    module: "MMM-Crypto",
    position: "middle_center",
    config: {
        showTradingViewWidget: true,
        widgetSymbol: "BITSTAMP:BTCUSD", // Your preferred symbol
        widgetTheme: "dark", // "dark" or "light"
        widgetDateRange: "1D", // 1D, 1W, 1M, 3M, 6M, YTD, 1Y, 5Y, ALL
        widgetChartOnly: false,
        widgetNoTimeScale: false,
        widgetIsTransparent: true,
        widgetLocale: "en",
        maxWidth: "600px"
    }
};

// Example 4: Multiple TradingView Widgets (Different Symbols)
const multipleTradingViewWidgets = [
    {
        module: "MMM-Crypto",
        position: "top_left",
        config: {
            showTradingViewWidget: true,
            widgetSymbol: "BITSTAMP:BTCUSD",
            widgetTheme: "dark",
            maxWidth: "400px"
        }
    },
    {
        module: "MMM-Crypto",
        position: "top_right", 
        config: {
            showTradingViewWidget: true,
            widgetSymbol: "BINANCE:ETHUSD",
            widgetTheme: "dark",
            maxWidth: "400px"
        }
    }
];

// Example 5: Chart-only TradingView Widget
const chartOnlyConfig = {
    module: "MMM-Crypto",
    position: "bottom_center",
    config: {
        showTradingViewWidget: true,
        widgetSymbol: "BITSTAMP:BTCUSD",
        widgetTheme: "dark",
        widgetChartOnly: true, // Shows only the chart, no additional info
        widgetDateRange: "1W",
        maxWidth: "500px"
    }
};

// Example 4: Compact mode for smaller displays
const compactConfig = {
    module: "MMM-Crypto",
    position: "bottom_right",
    config: {
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD", "SOLUSD"],
        updateInterval: 120000, // 2 minutes
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

// Example 5: Multiple instances - Price table + TradingView widget
const priceTableConfig = {
    module: "MMM-Crypto",
    position: "top_left",
    config: {
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD"],
        showChange: true,
        showVolume: true,
        compactMode: true,
        maxWidth: "350px"
    }
};

const chartWidgetConfig = {
    module: "MMM-Crypto",
    position: "bottom_center",
    config: {
        showTradingViewWidget: true,
        widgetSymbol: "BINANCE:BTCUSD",
        widgetTheme: "dark",
        maxWidth: "500px"
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
    tradingViewWidgetConfig,
    compactConfig,
    priceTableConfig,
    chartWidgetConfig
};

/* 
 * AVAILABLE SYMBOLS (mapped to CoinGecko data):
 * 
 * Major Cryptocurrencies:
 * - BTCUSD (Bitcoin)
 * - ETHUSD (Ethereum)
 * - ADAUSD (Cardano)
 * - SOLUSD (Solana)
 * - BNBUSD (Binance Coin)
 * - XRPUSD (XRP)
 * - DOGEUSD (Dogecoin)
 * 
 * DeFi & Layer 2:
 * - MATICUSD (Polygon)
 * - LINKUSD (Chainlink)
 * - AVAXUSD (Avalanche)
 * - DOTUSD (Polkadot)
 * - ATOMUSD (Cosmos)
 * - UNIUSD (Uniswap)
 * 
 * Traditional Cryptos:
 * - LTCUSD (Litecoin)
 * - BCHUSD (Bitcoin Cash)
 * - XLMUSD (Stellar)
 * - ETCUSD (Ethereum Classic)
 * 
 * Gaming & NFT:
 * - MANAUSD (Decentraland)
 * - SANDUSD (The Sandbox)
 * - AXSUSD (Axie Infinity)
 * - ENJUSD (Enjin Coin)
 * - CHZUSD (Chiliz)
 * 
 * TradingView Widget Symbols (for showTradingViewWidget: true):
 * - BINANCE:BTCUSD
 * - COINBASE:BTCUSD
 * - KRAKEN:XBTUSD
 * - BITFINEX:BTCUSD
 * - And many more...
 */
# MMM-Crypto (TradingView Edition)

A cryptocurrency price display module for MagicMirror² that uses **TradingView's official HTML widgets** for real-time crypto data and beautiful charts.

## ✨ Features

- **🎯 TradingView Integration**: Uses official TradingView HTML widgets (no API limits!)
- **📊 Real-time Data**: Live cryptocurrency prices and charts
- **🎨 Beautiful Design**: TradingView's professional-grade charts and styling
- **🌙 Dark Theme**: Perfect for Magic Mirror displays
- **📱 Responsive**: Adapts to different screen sizes
- **⚡ No API Keys**: No registration or API keys required
- **🔄 Auto-updating**: Widgets update automatically
- **💰 Multiple Symbols**: Support for any TradingView cryptocurrency symbol
- **📈 Chart Control**: Enable/disable chart display
- **🔢 Multi-Crypto Widget**: Display multiple cryptocurrencies in one widget
- **🎛️ Flexible Widget Types**: Choose from different TradingView widget styles

## 🚀 Quick Start

### Installation

1. Navigate to your MagicMirror modules directory:
```bash
cd ~/MagicMirror/modules
```

2. Clone this repository:
```bash
git clone https://github.com/yourusername/MMM-Crypto.git
```

3. Install dependencies:
```bash
cd MMM-Crypto
npm install
```

### Basic Configuration

Add this to your `config/config.js` file:

```javascript
{
    module: "MMM-Crypto",
    position: "top_right",
    config: {
        showTradingViewWidget: true,
        widgetSymbol: "BITSTAMP:BTCUSD",
        widgetTheme: "dark",
        maxWidth: "400px"
    }
}
```

## 📋 Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `showTradingViewWidget` | Boolean | `true` | Show TradingView widget (recommended) |
| `widgetSymbol` | String | `"BITSTAMP:BTCUSD"` | TradingView symbol (exchange:symbol format) |
| `widgetTheme` | String | `"dark"` | Widget theme: "dark" or "light" |
| `widgetDateRange` | String | `"1D"` | Chart timeframe: "1D", "1W", "1M", "3M", "6M", "YTD", "1Y", "5Y", "ALL" |
| `widgetChartOnly` | Boolean | `false` | Show only chart without additional info |
| `widgetNoTimeScale` | Boolean | `false` | Hide time scale on chart |
| `widgetIsTransparent` | Boolean | `true` | Transparent background |
| `widgetLocale` | String | `"en"` | Widget language |
| `maxWidth` | String | `"450px"` | Maximum width of the widget |
| `widgetHeight` | String | `"220"` | Height of the widget in pixels |
| **NEW OPTIONS** | | | |
| `multipleSymbols` | Boolean | `false` | Enable multiple cryptocurrencies in one widget |
| `cryptoSymbols` | Array | `["BITSTAMP:BTCUSD", "BINANCE:ETHUSD", "BINANCE:ADAUSD"]` | Array of symbols for multi-crypto widget |
| `showChart` | Boolean | `true` | Enable/disable chart display |
| `widgetType` | String | `"mini-symbol-overview"` | Widget type: "mini-symbol-overview", "symbol-overview", "market-quotes" |

## 🎯 Popular TradingView Symbols

### Major Cryptocurrencies
- `BITSTAMP:BTCUSD` - Bitcoin
- `BINANCE:ETHUSD` - Ethereum  
- `BINANCE:ADAUSD` - Cardano
- `BINANCE:SOLUSD` - Solana
- `BINANCE:BNBUSD` - Binance Coin
- `BINANCE:XRPUSD` - XRP
- `BINANCE:MATICUSD` - Polygon
- `BINANCE:DOTUSD` - Polkadot
- `BINANCE:AVAXUSD` - Avalanche
- `BINANCE:LINKUSD` - Chainlink

### Different Exchanges
- `COINBASE:BTCUSD`
- `KRAKEN:BTCUSD`
- `BITFINEX:BTCUSD`
- `BYBIT:BTCUSDT`

## 📖 Example Configurations

### Single Bitcoin Widget
```javascript
{
    module: "MMM-Crypto",
    position: "top_right",
    config: {
        showTradingViewWidget: true,
        widgetSymbol: "BITSTAMP:BTCUSD",
        widgetTheme: "dark",
        maxWidth: "400px"
    }
}
```

### Multiple Cryptocurrencies in One Widget (Bitcoin, Ethereum, Solana)
```javascript
{
    module: "MMM-Crypto",
    position: "top_center",
    config: {
        showTradingViewWidget: true,
        multipleSymbols: true,
        cryptoSymbols: ["BITSTAMP:BTCUSD", "BINANCE:ETHUSD", "BINANCE:SOLUSD"],
        widgetTheme: "dark",
        widgetType: "market-quotes",
        maxWidth: "500px",
        widgetHeight: "300"
    }
}
```

### Chart-Only Widget (No Price Data)
```javascript
{
    module: "MMM-Crypto",
    position: "bottom_center",
    config: {
        showTradingViewWidget: true,
        widgetSymbol: "BITSTAMP:BTCUSD",
        widgetTheme: "dark",
        widgetChartOnly: true,
        showChart: true,
        widgetDateRange: "1W",
        maxWidth: "600px"
    }
}
```

### Price-Only Widget (No Chart)
```javascript
{
    module: "MMM-Crypto",
    position: "top_left",
    config: {
        showTradingViewWidget: true,
        widgetSymbol: "BINANCE:ETHUSD",
        widgetTheme: "dark",
        showChart: false,
        widgetType: "mini-symbol-overview",
        maxWidth: "300px"
    }
}
```

### Multiple Separate Widgets
```javascript
[
    {
        module: "MMM-Crypto",
        position: "top_left",
        config: {
            showTradingViewWidget: true,
            widgetSymbol: "BITSTAMP:BTCUSD",
            widgetTheme: "dark",
            maxWidth: "350px"
        }
    },
    {
        module: "MMM-Crypto",
        position: "top_right",
        config: {
            showTradingViewWidget: true,
            widgetSymbol: "BINANCE:ETHUSD",
            widgetTheme: "dark",
            maxWidth: "350px"
        }
    }
]
```

## 🎨 Widget Types

- **`mini-symbol-overview`**: Compact widget with price and mini chart
- **`symbol-overview`**: Full widget with detailed information and chart
- **`market-quotes`**: Table format for multiple symbols (best for `multipleSymbols: true`)

## 🎨 Styling

The module includes CSS styling that matches Magic Mirror's design. The TradingView widgets automatically adapt to the dark theme.

## 🔧 Troubleshooting

### Widget Not Loading
- Check your internet connection
- Verify the symbol format (should be `EXCHANGE:SYMBOL`)
- Try a different exchange (e.g., BINANCE instead of BITSTAMP)

### Widget Too Small/Large
- Adjust the `maxWidth` setting
- Use responsive CSS units (%, vw, etc.)
- Modify `widgetHeight` for vertical sizing

### Symbol Not Found
- Verify the symbol exists on TradingView
- Check the exchange name spelling
- Try alternative exchanges for the same cryptocurrency

### Multiple Symbols Not Showing
- Ensure `multipleSymbols: true` is set
- Use `widgetType: "market-quotes"` for best results
- Check that all symbols in `cryptoSymbols` array are valid

## 🌐 TradingView Symbol Format

TradingView uses the format `EXCHANGE:SYMBOL`. Common exchanges:
- **BINANCE** - Largest crypto exchange
- **COINBASE** - US-based exchange  
- **BITSTAMP** - European exchange
- **KRAKEN** - US/European exchange
- **BITFINEX** - Global exchange

## 📄 License

MIT License - feel free to use and modify!

## 🤝 Contributing

Pull requests are welcome! Please feel free to submit issues and enhancement requests.

## 🙏 Credits

- **TradingView** for providing excellent financial widgets
- **MagicMirror²** community for the amazing platform
- **CoinGecko** for cryptocurrency data (legacy mode)
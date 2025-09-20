# MMM-Crypto (TradingView Edition)

A cryptocurrency price checker module for MagicMirror² that displays real-time cryptocurrency prices using TradingView's professional-grade data feeds.

![MMM-Crypto Screenshot](screenshot.png)

## Features

- 📊 **Real-time cryptocurrency prices** from TradingView
- 🔄 **WebSocket support** for live data updates
- 📈 **24-hour price changes** with professional color coding
- 📊 **Volume, High, Low** data display
- 🏢 **Multiple exchange support** (Binance, Coinbase, Kraken, etc.)
- 🎨 **TradingView-style** color scheme and formatting
- 🖼️ **Cryptocurrency icons** for visual appeal
- ⏰ **Live data indicators** and connection status
- 📱 **Responsive design** with compact mode
- 🎯 **Professional trading symbols** (BTCUSD, ETHUSD, etc.)

## Why TradingView?

- ✅ **Professional-grade data** used by millions of traders
- ✅ **Real-time WebSocket feeds** for instant updates
- ✅ **Multiple exchange support** with consistent formatting
- ✅ **Higher reliability** and uptime compared to free APIs
- ✅ **No API key required** for basic functionality
- ✅ **Lower latency** for price updates

## Installation

1. Navigate to your MagicMirror's modules folder:
```bash
cd ~/MagicMirror/modules
```

2. Clone this repository:
```bash
git clone https://github.com/yourusername/MMM-Crypto.git
```

3. Navigate to the module folder and install dependencies:
```bash
cd MMM-Crypto
npm install
```

## Configuration

Add the module to your `config/config.js` file:

```javascript
{
    module: "MMM-Crypto",
    position: "top_right",
    config: {
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD"],
        exchange: "BINANCE",
        useWebSocket: true
    }
}
```

### Configuration Options

| Option | Type | Default | Description |
|--------|------|---------|-------------|
| `updateInterval` | Number | `30000` | Update interval in milliseconds (for REST API fallback) |
| `animationSpeed` | Number | `1000` | Animation speed for DOM updates |
| `symbols` | Array | `["BTCUSD", "ETHUSD", "ADAUSD", "SOLUSD", "DOGEUSD"]` | TradingView symbols to display |
| `exchange` | String | `"BINANCE"` | Exchange to get data from |
| `showChange` | Boolean | `true` | Show 24-hour price change |
| `showVolume` | Boolean | `true` | Show 24-hour trading volume |
| `showHigh` | Boolean | `false` | Show 24-hour high price |
| `showLow` | Boolean | `false` | Show 24-hour low price |
| `showExchange` | Boolean | `false` | Show exchange name |
| `maxWidth` | String | `"450px"` | Maximum width of the module |
| `colored` | Boolean | `true` | Color-code price changes (TradingView colors) |
| `showIcon` | Boolean | `true` | Show cryptocurrency icons |
| `showLastUpdate` | Boolean | `true` | Show last update timestamp |
| `decimalPlaces` | Number | `2` | Number of decimal places for prices |
| `useWebSocket` | Boolean | `true` | Use WebSocket for real-time data |
| `compactMode` | Boolean | `false` | Use compact display mode |

### Example Configurations

#### Basic Real-time Setup
```javascript
{
    module: "MMM-Crypto",
    position: "top_right",
    config: {
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD"],
        exchange: "BINANCE",
        useWebSocket: true,
        showChange: true,
        colored: true
    }
}
```

#### Advanced Trading Dashboard
```javascript
{
    module: "MMM-Crypto",
    position: "top_right",
    config: {
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD", "SOLUSD", "BNBUSD", "XRPUSD"],
        exchange: "BINANCE",
        useWebSocket: true,
        showChange: true,
        showVolume: true,
        showHigh: true,
        showLow: true,
        showExchange: true,
        colored: true,
        maxWidth: "500px"
    }
}
```

#### Compact Mode for Small Displays
```javascript
{
    module: "MMM-Crypto",
    position: "bottom_right",
    config: {
        symbols: ["BTCUSD", "ETHUSD", "ADAUSD"],
        exchange: "BINANCE",
        useWebSocket: true,
        compactMode: true,
        showVolume: false,
        maxWidth: "300px"
    }
}
```

## Supported Exchanges

- **BINANCE** - Binance (recommended for most symbols)
- **COINBASE** - Coinbase Pro
- **KRAKEN** - Kraken
- **BITFINEX** - Bitfinex
- **BITSTAMP** - Bitstamp
- **GEMINI** - Gemini

## Popular Trading Symbols

### Major Cryptocurrencies
- `BTCUSD` - Bitcoin
- `ETHUSD` - Ethereum
- `ADAUSD` - Cardano
- `SOLUSD` - Solana
- `BNBUSD` - Binance Coin
- `XRPUSD` - XRP
- `DOGEUSD` - Dogecoin

### DeFi & Layer 2
- `MATICUSD` - Polygon
- `LINKUSD` - Chainlink
- `AVAXUSD` - Avalanche
- `DOTUSD` - Polkadot
- `ATOMUSD` - Cosmos

### Traditional Cryptos
- `LTCUSD` - Litecoin
- `BCHUSD` - Bitcoin Cash
- `XLMUSD` - Stellar

## Real-time Features

### WebSocket Connection
- 🟢 **Green indicator**: Connected and receiving live data
- 🔴 **Red indicator**: Disconnected, using cached/REST data
- **Auto-reconnection**: Automatically reconnects on connection loss

### Live Data Updates
- **Instant price updates** as they happen on the exchange
- **Smooth animations** for price changes
- **Color-coded changes** (green for up, red for down)
- **Volume and high/low updates** in real-time

## Troubleshooting

### WebSocket Issues
- **Connection problems**: Module will automatically fall back to REST API
- **Firewall blocking**: Ensure WebSocket connections are allowed
- **Network issues**: Check internet connectivity

### Symbol Not Found
- Verify the symbol exists on the selected exchange
- Check TradingView for correct symbol format
- Some exchanges may use different symbol formats

### Performance Issues
- **Too many symbols**: Limit to 10-15 symbols for optimal performance
- **Update frequency**: Increase `updateInterval` if experiencing lag
- **Compact mode**: Use for better performance on slower devices

## Technical Details

### Data Sources
- **Primary**: TradingView WebSocket API for real-time data
- **Fallback**: TradingView REST API for historical/cached data
- **Icons**: CryptoLogos.cc for cryptocurrency icons

### WebSocket Protocol
- Uses TradingView's proprietary WebSocket protocol
- Handles authentication and session management automatically
- Implements reconnection logic with exponential backoff

### Performance Optimizations
- **Efficient DOM updates**: Only updates changed values
- **Connection pooling**: Reuses WebSocket connections
- **Error handling**: Graceful degradation on API failures

## Contributing

1. Fork the repository
2. Create a feature branch
3. Test with multiple exchanges and symbols
4. Submit a pull request

## License

This project is licensed under the MIT License - see the LICENSE file for details.

## Changelog

### v2.0.0 (TradingView Edition)
- **NEW**: TradingView data integration
- **NEW**: Real-time WebSocket support
- **NEW**: Multiple exchange support
- **NEW**: Professional trading symbols
- **NEW**: TradingView-style color scheme
- **NEW**: Volume, High, Low data display
- **NEW**: Compact mode for small displays
- **IMPROVED**: Better error handling and reconnection
- **IMPROVED**: More responsive design

### v1.0.0
- Initial release with CoinGecko integration

## Support

For issues or feature requests:
1. Check the troubleshooting section
2. Verify your symbol and exchange combination on TradingView
3. Create an issue with detailed information including:
   - Your configuration
   - Console error messages
   - Network connectivity status

## Acknowledgments

- [MagicMirror²](https://magicmirror.builders/) for the amazing platform
- [TradingView](https://www.tradingview.com/) for professional-grade financial data
- [CryptoLogos.cc](https://cryptologos.cc/) for cryptocurrency icons
- The MagicMirror community for inspiration and support
import React, { useEffect, useState } from 'react';
import Chart from './components/Chart';

export default function App() {
  const [price, setPrice] = useState(null);
  const [stats, setStats] = useState({ high: 0, low: 0, volume: 0 });

  // Harga live
  useEffect(() => {
    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@trade');
    ws.onmessage = (event) => {
      const data = JSON.parse(event.data);
      setPrice(parseFloat(data.p).toFixed(2));
    };
    return () => ws.close();
  }, []);

  // Data high/low/volume
  useEffect(() => {
    fetch('https://api.binance.com/api/v3/ticker/24hr?symbol=BTCUSDT')
      .then(res => res.json())
      .then(data => {
        setStats({
          high: parseFloat(data.highPrice).toFixed(2),
          low: parseFloat(data.lowPrice).toFixed(2),
          volume: parseFloat(data.volume).toFixed(2)
        });
      });
  }, []);

  return (
    <div style={{ background: '#0d1117', color: 'white', minHeight: '100vh', padding: '20px' }}>
      <h1>BTC/USDT Live Chart</h1>
      <h2 style={{ color: '#00ff99' }}>{price ? `$${price}` : 'Loading...'}</h2>
      <p>24h High: ${stats.high} | 24h Low: ${stats.low} | Volume: {stats.volume} BTC</p>
      <Chart />
    </div>
  );
}

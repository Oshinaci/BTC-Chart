import React, { useEffect, useRef } from 'react';
import { createChart } from 'lightweight-charts';

export default function Chart() {
  const chartContainerRef = useRef();

  useEffect(() => {
    const chart = createChart(chartContainerRef.current, {
      width: chartContainerRef.current.clientWidth,
      height: 400,
      layout: { background: { color: '#0d1117' }, textColor: 'white' },
      grid: { vertLines: { color: '#1e222d' }, horzLines: { color: '#1e222d' } },
    });

    const candleSeries = chart.addCandlestickSeries();

    fetch('https://api.binance.com/api/v3/klines?symbol=BTCUSDT&interval=1m&limit=100')
      .then(res => res.json())
      .then(data => {
        const formatted = data.map(candle => ({
          time: candle[0] / 1000,
          open: parseFloat(candle[1]),
          high: parseFloat(candle[2]),
          low: parseFloat(candle[3]),
          close: parseFloat(candle[4]),
        }));
        candleSeries.setData(formatted);
      });

    const ws = new WebSocket('wss://stream.binance.com:9443/ws/btcusdt@kline_1m');
    ws.onmessage = (event) => {
      const msg = JSON.parse(event.data);
      const c = msg.k;
      candleSeries.update({
        time: c.t / 1000,
        open: parseFloat(c.o),
        high: parseFloat(c.h),
        low: parseFloat(c.l),
        close: parseFloat(c.c),
      });
    };

    return () => ws.close();
  }, []);

  return <div ref={chartContainerRef} style={{ marginTop: '20px' }} />;
}

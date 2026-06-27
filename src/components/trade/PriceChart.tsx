"use client";

import { useEffect, useRef, useState } from "react";
import { createChart, CandlestickSeries, type CandlestickData } from "lightweight-charts";

const INTERVALS = ["15m", "1H", "4H", "1D"] as const;
type Interval = (typeof INTERVALS)[number];

const ERROR_MESSAGES: Record<string, string> = {
  rate_limited: "Chart data rate limited — try again in a minute",
  no_data: "No chart data for this token",
  unavailable: "Chart data temporarily unavailable",
  unconfigured: "BirdEye API key not configured",
};

function validCandles(candles?: CandlestickData[]) {
  return (candles ?? []).filter(
    (c) => c.open != null && c.high != null && c.low != null && c.close != null
  );
}

export function PriceChart({ mint }: { mint: string }) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [interval, setInterval] = useState<Interval>("1H");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const chart = createChart(container, {
      layout: { background: { color: "#18181B" }, textColor: "#A1A1AA" },
      grid: { vertLines: { color: "#27272A" }, horzLines: { color: "#27272A" } },
      rightPriceScale: { borderColor: "#27272A" },
      timeScale: { borderColor: "#27272A", timeVisible: true },
      width: container.clientWidth,
      height: 300,
    });

    const series = chart.addSeries(CandlestickSeries, {
      upColor: "#22C55E",
      downColor: "#EF4444",
      borderUpColor: "#22C55E",
      borderDownColor: "#EF4444",
      wickUpColor: "#22C55E",
      wickDownColor: "#EF4444",
    });

    const ro = new ResizeObserver(() => {
      chart.applyOptions({ width: container.clientWidth });
    });
    ro.observe(container);

    let cancelled = false;
    setLoading(true);
    setError(null);

    async function load(retry = false) {
      try {
        const body = await fetch(`/api/tokens/${mint}/ohlcv?type=${interval}`).then((r) => r.json());
        if (cancelled) return;
        const candles = validCandles(body.candles);
        if (candles.length) {
          series.setData(candles);
          chart.timeScale().fitContent();
          setError(null);
          setLoading(false);
          return;
        }
        if (body.error === "rate_limited" && !retry) {
          await new Promise((r) => setTimeout(r, 1500));
          if (!cancelled) return load(true);
          return;
        }
        setError(ERROR_MESSAGES[body.error ?? "no_data"] ?? ERROR_MESSAGES.no_data);
        setLoading(false);
      } catch {
        if (!cancelled) {
          setError(ERROR_MESSAGES.unavailable);
          setLoading(false);
        }
      }
    }

    load();

    return () => {
      cancelled = true;
      ro.disconnect();
      chart.remove();
    };
  }, [mint, interval]);

  return (
    <div>
      <div className="flex gap-1 mb-2">
        {INTERVALS.map((iv) => (
          <button
            key={iv}
            onClick={() => setInterval(iv)}
            className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
              interval === iv ? "bg-chad-accent text-chad-bg" : "text-chad-muted hover:text-white"
            }`}
          >
            {iv}
          </button>
        ))}
      </div>
      <div className="relative">
        <div ref={containerRef} className="w-full" />
        {(loading || error) && (
          <div className="absolute inset-0 flex items-center justify-center bg-chad-card/80 rounded-lg">
            <p className="text-chad-muted text-xs text-center px-4">
              {loading ? "Loading chart…" : error}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

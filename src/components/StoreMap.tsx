"use client";

import { useEffect, useState } from "react";
import { Map } from "lucide-react";

interface StoreMapProps {
  address: string;
  className?: string;
  /** 地図アイコン・ラベル（「地図」）の表示有無。未指定時は true */
  showTitle?: boolean;
  /** マーカー表示の有無。true のとき住所をジオコードしてマーカー表示。未指定時は true */
  showMarker?: boolean;
}

interface GeocodeResult {
  lat: string;
  lon: string;
}

/**
 * 住所を使って Google Maps iframe で位置を表示するコンポーネント（マーカー付き）
 * 共通利用可能
 */
export function StoreMap({ address, className = "", showTitle = true, showMarker = true }: StoreMapProps) {
  const [coords, setCoords] = useState<{ lat: string; lon: string } | null>(null);
  const [geocodeLoading, setGeocodeLoading] = useState(showMarker);

  const trimmedAddress = address?.trim();

  useEffect(() => {
    if (!trimmedAddress || !showMarker) {
      setCoords(null);
      setGeocodeLoading(false);
      return;
    }
    setGeocodeLoading(true);
    const controller = new AbortController();
    const encodedAddress = encodeURIComponent(trimmedAddress);
    const url = `https://nominatim.openstreetmap.org/search?q=${encodedAddress}&format=json&limit=1`;

    fetch(url, {
      headers: {
        Accept: "application/json",
        "Accept-Language": "ja",
        "User-Agent": "HomeCenterStoreMap/1.0 (store-location)",
      },
      signal: controller.signal,
    })
      .then((res) => res.json())
      .then((data: GeocodeResult[]) => {
        if (data?.[0]) {
          setCoords({ lat: data[0].lat, lon: data[0].lon });
        } else {
          setCoords(null);
        }
      })
      .catch(() => setCoords(null))
      .finally(() => setGeocodeLoading(false));

    return () => controller.abort();
  }, [trimmedAddress, showMarker]);

  if (!trimmedAddress) return null;

  const encodedAddress = encodeURIComponent(trimmedAddress);
  const useCoords = showMarker && coords;
  const embedUrl = useCoords
    ? `https://www.google.com/maps?q=${coords.lat},${coords.lon}&z=17&output=embed&hl=ja`
    : `https://www.google.com/maps?q=${encodedAddress}&output=embed&hl=ja`;

  return (
    <div className={className}>
      {showTitle && (
        <div className="text-lg font-medium mb-2 flex items-center gap-2">
          <Map className="h-5 w-5 shrink-0" />
          地図
        </div>
      )}
      <div className="border rounded-lg overflow-hidden aspect-video min-h-[240px] bg-muted relative">
        {showMarker && geocodeLoading && (
          <div className="absolute inset-0 flex items-center justify-center bg-muted/80 z-10 text-sm text-muted-foreground rounded-lg">
            地図を読み込み中...
          </div>
        )}
        <iframe
          title="店舗の地図"
          src={embedUrl}
          width="100%"
          height="100%"
          style={{ minHeight: "240px", border: 0 }}
          allowFullScreen
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      </div>
      <a
        href={
          useCoords && coords
            ? `https://www.google.com/maps?q=${coords.lat},${coords.lon}&hl=ja`
            : `https://www.google.com/maps/search/?api=1&query=${encodedAddress}&hl=ja`
        }
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-primary hover:underline mt-2 inline-block"
      >
        Google マップで開く
      </a>
    </div>
  );
}

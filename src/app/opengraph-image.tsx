import { ImageResponse } from "next/og";

export const alt = "trim.it — long links in, short links out";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

const BG = "#0a0b0d";
const FG = "#f4f4f0";
const MUTED = "#7d8087";
const ACCENT = "#c6ff3d";

export default function OpengraphImage() {
  const streaks = [90, 150, 215, 470, 530];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: BG,
          color: FG,
          padding: "72px 80px",
          fontFamily: "monospace",
          position: "relative",
        }}
      >
        {streaks.map((top, i) => (
          <div
            key={top}
            style={{
              position: "absolute",
              top,
              left: 560 + i * 40,
              width: 520 - i * 60,
              height: 2,
              background: i % 2 === 0 ? ACCENT : "#2a2d33",
              opacity: i % 2 === 0 ? 0.55 : 1,
            }}
          />
        ))}
        <div style={{ display: "flex", alignItems: "center", gap: 16, fontSize: 34 }}>
          <div style={{ width: 18, height: 18, background: ACCENT }} />
          <span style={{ fontWeight: 700 }}>trim.it</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 28 }}>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3 }}>
            Long links in.
          </div>
          <div style={{ display: "flex", fontSize: 84, fontWeight: 800, lineHeight: 1.02, letterSpacing: -3, color: ACCENT }}>
            Short links out.
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 14, fontSize: 28 }}>
          <div style={{ display: "flex", color: MUTED, textDecoration: "line-through" }}>
            https://example-store.com/collections/summer-2026/products/linen-shirt?utm_source=…
          </div>
          <div style={{ display: "flex", gap: 18 }}>
            <span style={{ color: ACCENT }}>→</span>
            <span>trimit.zameel7.me/s/linen</span>
            <span style={{ color: MUTED }}>· 1,284 clicks</span>
          </div>
        </div>
      </div>
    ),
    size,
  );
}

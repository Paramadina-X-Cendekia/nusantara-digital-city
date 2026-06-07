import { useEffect, useRef } from "react";

/**
 * NusantaraDigitalBackground (STATIC / NO-LAG VERSION)
 *
 * Versi ini sengaja dibuat "kaku" (tidak ada animasi frame-by-frame,
 * tidak ada mouse tracking, tidak ada requestAnimationFrame) supaya
 * scroll hero section tetap mulus 60fps di device low-end.
 *
 * Pattern di-render SEKALI ke <canvas> saat mount, dan hanya
 * di-render ulang ketika ukuran container / theme berubah.
 *
 * Motif Nusantara yang dipakai:
 *  - Kawung (Yogyakarta/Solo) sebagai node grid
 *  - Mega Mendung (Cirebon) sebagai awan latar
 *  - Parang sebagai garis diagonal
 *  - Tumpal (segitiga emas) di tepi atas & bawah
 *  - Skyline: Candi Borobudur + Joglo + gedung modern
 *  - Songket diamond di pusat Kawung
 */
export default function NusantaraDigitalBackground({ className = "" }) {
  const canvasRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const wrap = wrapRef.current;
    if (!canvas || !wrap) return;

    const isDark = () =>
      document.documentElement.classList.contains("dark") ||
      window.matchMedia?.("(prefers-color-scheme: dark)").matches;

    const draw = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const w = wrap.clientWidth;
      const h = wrap.clientHeight;
      canvas.width = w * dpr;
      canvas.height = h * dpr;
      canvas.style.width = w + "px";
      canvas.style.height = h + "px";
      const ctx = canvas.getContext("2d");
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);

      const dark = isDark();

      // Palette Nusantara — base agak kebiruan (indigo batik)
      const C = {
        bg: dark ? "#0a0f1a" : "#eaf0f8",
        bg2: dark ? "#0f1830" : "#d6e2f0",
        gold: dark ? "#d4a64a" : "#b8862c",
        goldSoft: dark ? "rgba(212,166,74,0.32)" : "rgba(184,134,44,0.4)",
        copper: dark ? "#b87333" : "#a05a1f",
        maroon: dark ? "#7a1f1f" : "#6b1717",
        indigo: dark ? "#3a4a80" : "#3b4680",
        line: dark ? "rgba(150,180,220,0.10)" : "rgba(60,90,150,0.10)",
        cloud: dark ? "rgba(120,150,200,0.12)" : "rgba(60,90,150,0.10)",
        ink: dark ? "#dfe6f2" : "#1a2540",
      };

      // 1) Base gradient
      const bg = ctx.createLinearGradient(0, 0, 0, h);
      bg.addColorStop(0, C.bg);
      bg.addColorStop(1, C.bg2);
      ctx.fillStyle = bg;
      ctx.fillRect(0, 0, w, h);

      // 2) Mega Mendung (awan berlapis) — bentuk gelombang sederhana
      const drawMendung = (cx, cy, scale, alpha) => {
        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(scale, scale);
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = C.indigo;
        ctx.lineWidth = 2;
        for (let layer = 0; layer < 4; layer++) {
          ctx.beginPath();
          const r = 30 + layer * 14;
          for (let a = Math.PI; a <= Math.PI * 2 + 0.01; a += 0.05) {
            const wob = Math.sin(a * 6) * 3;
            const x = Math.cos(a) * (r + wob);
            const y = Math.sin(a) * (r + wob) * 0.45;
            if (a === Math.PI) ctx.moveTo(x, y);
            else ctx.lineTo(x, y);
          }
          ctx.stroke();
        }
        ctx.restore();
      };
      drawMendung(w * 0.15, h * 0.25, 1.2, 0.7);
      drawMendung(w * 0.78, h * 0.18, 1.5, 0.6);
      drawMendung(w * 0.45, h * 0.55, 1.0, 0.5);
      drawMendung(w * 0.9, h * 0.65, 1.3, 0.55);

      // 3) Parang diagonal lines
      ctx.save();
      ctx.strokeStyle = C.goldSoft;
      ctx.lineWidth = 1;
      const step = 90;
      for (let i = -h; i < w + h; i += step) {
        ctx.beginPath();
        ctx.moveTo(i, 0);
        ctx.lineTo(i + h, h);
        ctx.stroke();
        ctx.beginPath();
        ctx.globalAlpha = 0.5;
        ctx.moveTo(i + 20, 0);
        ctx.lineTo(i + 20 + h, h);
        ctx.stroke();
        ctx.globalAlpha = 1;
      }
      ctx.restore();

      // 4) Grid tipis
      const CELL = 130;
      ctx.strokeStyle = C.line;
      ctx.lineWidth = 1;
      for (let x = 0; x <= w; x += CELL) {
        ctx.beginPath();
        ctx.moveTo(x, 0);
        ctx.lineTo(x, h);
        ctx.stroke();
      }
      for (let y = 0; y <= h; y += CELL) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(w, y);
        ctx.stroke();
      }

      // 5) Kawung di setiap intersection
      const drawKawung = (cx, cy, r) => {
        ctx.save();
        ctx.translate(cx, cy);
        // 4 ellips utama
        ctx.strokeStyle = C.gold;
        ctx.lineWidth = 1.2;
        const positions = [
          [0, -r * 0.55],
          [0, r * 0.55],
          [-r * 0.55, 0],
          [r * 0.55, 0],
        ];
        positions.forEach(([dx, dy]) => {
          ctx.beginPath();
          ctx.ellipse(dx, dy, r * 0.5, r * 0.75, dx !== 0 ? Math.PI / 2 : 0, 0, Math.PI * 2);
          ctx.stroke();
          // inner maroon
          ctx.beginPath();
          ctx.fillStyle = dark ? "rgba(122,31,31,0.35)" : "rgba(107,23,23,0.18)";
          ctx.ellipse(dx, dy, r * 0.28, r * 0.45, dx !== 0 ? Math.PI / 2 : 0, 0, Math.PI * 2);
          ctx.fill();
        });
        // songket diamond center
        ctx.beginPath();
        ctx.fillStyle = C.gold;
        ctx.moveTo(0, -6);
        ctx.lineTo(6, 0);
        ctx.lineTo(0, 6);
        ctx.lineTo(-6, 0);
        ctx.closePath();
        ctx.fill();
        // node center
        ctx.beginPath();
        ctx.fillStyle = C.copper;
        ctx.arc(0, 0, 2, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      };
      for (let x = CELL; x < w; x += CELL) {
        for (let y = CELL; y < h - 120; y += CELL) {
          drawKawung(x, y, 22);
        }
      }

      // 6) Tumpal segitiga atas & bawah
      const drawTumpal = (yBase, flip) => {
        ctx.save();
        ctx.fillStyle = C.gold;
        ctx.globalAlpha = 0.55;
        const tw = 28;
        const th = 18;
        for (let x = 0; x < w; x += tw) {
          ctx.beginPath();
          if (flip) {
            ctx.moveTo(x, yBase);
            ctx.lineTo(x + tw, yBase);
            ctx.lineTo(x + tw / 2, yBase - th);
          } else {
            ctx.moveTo(x, yBase);
            ctx.lineTo(x + tw, yBase);
            ctx.lineTo(x + tw / 2, yBase + th);
          }
          ctx.closePath();
          ctx.fill();
        }
        ctx.restore();
      };
      drawTumpal(0, false);
      // (tumpal bawah dihapus supaya skyline nempel ke dasar canvas)

      // 7) Skyline: Borobudur + Joglo + gedung modern — NEMPEL ke bottom
      const skyY = h; // base garis tanah = paling bawah canvas
      // siluet tanah gelap supaya kota tampak berdiri di atasnya
      ctx.fillStyle = dark ? "rgba(10,8,5,0.9)" : "rgba(60,40,15,0.18)";
      ctx.fillRect(0, skyY - 6, w, 6);
      ctx.save();
      ctx.fillStyle = dark ? "rgba(212,166,74,0.18)" : "rgba(120,80,20,0.18)";
      ctx.strokeStyle = C.gold;
      ctx.lineWidth = 1;

      // Borobudur (kiri)
      const bx = w * 0.1;
      ctx.beginPath();
      ctx.moveTo(bx - 80, skyY);
      for (let i = -80; i <= 80; i += 4) {
        const y = skyY - 50 + Math.abs(i) * 0.3 - Math.cos(i / 12) * 6;
        ctx.lineTo(bx + i, y);
      }
      ctx.lineTo(bx + 80, skyY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
      // stupa atas
      ctx.beginPath();
      ctx.arc(bx, skyY - 60, 8, Math.PI, 0);
      ctx.fill();
      ctx.stroke();

      // Joglo (tengah)
      const jx = w * 0.4;
      ctx.beginPath();
      ctx.moveTo(jx - 60, skyY);
      ctx.lineTo(jx - 40, skyY - 25);
      ctx.lineTo(jx - 25, skyY - 30);
      ctx.lineTo(jx, skyY - 55);
      ctx.lineTo(jx + 25, skyY - 30);
      ctx.lineTo(jx + 40, skyY - 25);
      ctx.lineTo(jx + 60, skyY);
      ctx.closePath();
      ctx.fill();
      ctx.stroke();

      // Modern buildings (kanan)
      let mx = w * 0.6;
      const heights = [70, 110, 50, 95, 65, 130, 80, 45, 100];
      heights.forEach((bh) => {
        const bw = 28;
        ctx.fillRect(mx, skyY - bh, bw, bh);
        ctx.strokeRect(mx, skyY - bh, bw, bh);
        // antenna
        if (bh > 90) {
          ctx.beginPath();
          ctx.moveTo(mx + bw / 2, skyY - bh);
          ctx.lineTo(mx + bw / 2, skyY - bh - 15);
          ctx.stroke();
        }
        // windows
        ctx.save();
        ctx.fillStyle = C.goldSoft;
        for (let wy = skyY - bh + 6; wy < skyY - 6; wy += 8) {
          for (let wx = mx + 4; wx < mx + bw - 4; wx += 6) {
            ctx.fillRect(wx, wy, 3, 3);
          }
        }
        ctx.restore();
        mx += bw + 6;
        if (mx > w) return;
      });

      // garis tanah
      ctx.beginPath();
      ctx.strokeStyle = C.gold;
      ctx.lineWidth = 1;
      ctx.moveTo(0, skyY);
      ctx.lineTo(w, skyY);
      ctx.stroke();
      ctx.restore();

      // 8) Veil lembut — meredam semua motif supaya teks hero mudah dibaca
      //    (warna mengikuti bg, jadi palette tidak berubah)
      ctx.fillStyle = dark ? "rgba(10,15,26,0.55)" : "rgba(234,240,248,0.55)";
      ctx.fillRect(0, 0, w, h);

      // 9) Vignette halus
      const vg = ctx.createRadialGradient(w / 2, h / 2, Math.min(w, h) * 0.25, w / 2, h / 2, Math.max(w, h) * 0.8);
      vg.addColorStop(0, "rgba(0,0,0,0)");
      vg.addColorStop(1, dark ? "rgba(0,0,0,0.45)" : "rgba(30,50,90,0.14)");
      ctx.fillStyle = vg;
      ctx.fillRect(0, 0, w, h);

      // 10) Top fade
      const tg = ctx.createLinearGradient(0, 0, 0, h * 0.55);
      tg.addColorStop(0, dark ? "rgba(10,15,26,0.55)" : "rgba(234,240,248,0.6)");
      tg.addColorStop(1, "rgba(0,0,0,0)");
      ctx.fillStyle = tg;
      ctx.fillRect(0, 0, w, h * 0.55);
    };

    draw();

    // Redraw hanya saat resize / theme change — TIDAK ada animasi loop
    const ro = new ResizeObserver(() => draw());
    ro.observe(wrap);

    const mo = new MutationObserver(() => draw());
    mo.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });

    return () => {
      ro.disconnect();
      mo.disconnect();
    };
  }, []);

  return (
    <div
      ref={wrapRef}
      className={`absolute inset-0 overflow-hidden pointer-events-none ${className}`}
      aria-hidden="true"
    >
      <canvas ref={canvasRef} className="block w-full h-full" />
    </div>
  );
}

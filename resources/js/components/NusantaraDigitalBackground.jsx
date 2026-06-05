import { useRef, useEffect } from "react";

export default function NusantaraDigitalBackground({ mouseX, mouseY }) {
    const canvasRef = useRef(null);
    const mouseRef = useRef({ x: -9999, y: -9999 });
    const particlesRef = useRef([]);
    const rafRef = useRef(null);
    const tRef = useRef(0);

    useEffect(() => {
        mouseRef.current = { x: mouseX, y: mouseY };
    }, [mouseX, mouseY]);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        const DPR = Math.min(window.devicePixelRatio || 1, 2);
        const CELL = 110; // diperbesar supaya motif Kawung jelas terlihat

        let cols = 0;
        let rows = 0;

        function resize() {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            canvas.width = w * DPR;
            canvas.height = h * DPR;
            ctx.setTransform(DPR, 0, 0, DPR, 0, 0);
            cols = Math.ceil(w / CELL) + 1;
            rows = Math.ceil(h / CELL) + 1;

            particlesRef.current = Array.from({ length: 32 }, () => ({
                x: Math.random() * w,
                y: Math.random() * h,
                vx: (Math.random() - 0.5) * 0.4,
                vy: (Math.random() - 0.5) * 0.4,
                life: Math.random(),
            }));
        }

        function isDark() {
            return document.documentElement.classList.contains("dark");
        }

        // ============ PALET NUSANTARA ============
        // Emas kunyit, copper, indigo batik, merah maroon
        const palette = (dark) => ({
            gold: dark ? "250,204,21" : "180,83,9",      // emas / copper
            indigo: dark ? "96,165,250" : "30,58,138",   // indigo batik
            maroon: dark ? "248,113,113" : "153,27,27",  // merah tua
            cream: dark ? "254,243,199" : "120,53,15",   // krem / coklat
        });

        // ============ MOTIF: KAWUNG BESAR ============
        function drawKawung(cx, cy, r, alpha, p) {
            ctx.save();
            ctx.strokeStyle = `rgba(${p.gold},${alpha})`;
            ctx.lineWidth = 1.2;
            const off = r * 0.6;
            const positions = [
                [-off, 0], [off, 0], [0, -off], [0, off],
            ];
            positions.forEach(([dx, dy], idx) => {
                // elips luar
                ctx.beginPath();
                ctx.ellipse(cx + dx, cy + dy, r * 0.55, r * 0.78, 0, 0, Math.PI * 2);
                ctx.stroke();
                // elips dalam (detail batik)
                ctx.strokeStyle = `rgba(${p.maroon},${alpha * 0.7})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.ellipse(cx + dx, cy + dy, r * 0.32, r * 0.5, 0, 0, Math.PI * 2);
                ctx.stroke();
                ctx.strokeStyle = `rgba(${p.gold},${alpha})`;
                ctx.lineWidth = 1.2;
            });
            // Belah ketupat tengah (Songket)
            ctx.fillStyle = `rgba(${p.gold},${alpha * 0.9})`;
            ctx.beginPath();
            ctx.moveTo(cx, cy - 3.5);
            ctx.lineTo(cx + 3.5, cy);
            ctx.lineTo(cx, cy + 3.5);
            ctx.lineTo(cx - 3.5, cy);
            ctx.closePath();
            ctx.fill();
            // Titik2 kecil di antara kelopak (biji kawung)
            ctx.fillStyle = `rgba(${p.maroon},${alpha * 0.8})`;
            [[off, off], [-off, off], [off, -off], [-off, -off]].forEach(([dx, dy]) => {
                ctx.beginPath();
                ctx.arc(cx + dx * 0.7, cy + dy * 0.7, 1.3, 0, Math.PI * 2);
                ctx.fill();
            });
            ctx.restore();
        }

        // ============ MOTIF: PARANG (diagonal lereng) ============
        function drawParang(w, h, p, dark) {
            ctx.save();
            const gap = 44;
            for (let i = -h; i < w + h; i += gap) {
                // garis utama Parang
                ctx.strokeStyle = `rgba(${p.indigo},${dark ? 0.09 : 0.08})`;
                ctx.lineWidth = 1.4;
                ctx.beginPath();
                ctx.moveTo(i, 0);
                ctx.lineTo(i + h, h);
                ctx.stroke();
                // garis pasangan (lereng ganda)
                ctx.strokeStyle = `rgba(${p.gold},${dark ? 0.06 : 0.05})`;
                ctx.lineWidth = 0.8;
                ctx.beginPath();
                ctx.moveTo(i + 10, 0);
                ctx.lineTo(i + h + 10, h);
                ctx.stroke();
            }
            ctx.restore();
        }

        // ============ MOTIF: MEGA MENDUNG (awan Cirebon) ============
        function drawMegaMendung(cx, cy, scale, alpha, p) {
            ctx.save();
            ctx.strokeStyle = `rgba(${p.indigo},${alpha})`;
            ctx.lineWidth = 1.1;
            // 4 lapis awan bergelombang
            for (let layer = 0; layer < 4; layer++) {
                const r = scale * (1 + layer * 0.35);
                ctx.beginPath();
                for (let a = 0; a <= Math.PI * 2; a += 0.05) {
                    // bentuk awan: gelombang sinus
                    const wob = r + Math.sin(a * 6) * scale * 0.18;
                    const x = cx + Math.cos(a) * wob;
                    const y = cy + Math.sin(a) * wob * 0.55; // pipih horisontal
                    if (a === 0) ctx.moveTo(x, y);
                    else ctx.lineTo(x, y);
                }
                ctx.closePath();
                ctx.stroke();
            }
            ctx.restore();
        }

        // ============ MOTIF: TUMPAL (border segitiga songket) ============
        function drawTumpal(w, h, p, dark) {
            ctx.save();
            const tw = 22; // lebar segitiga
            const th = 14; // tinggi
            ctx.fillStyle = `rgba(${p.gold},${dark ? 0.18 : 0.14})`;
            ctx.strokeStyle = `rgba(${p.maroon},${dark ? 0.25 : 0.22})`;
            ctx.lineWidth = 0.8;
            // atas (menghadap ke bawah)
            for (let x = 0; x < w; x += tw) {
                ctx.beginPath();
                ctx.moveTo(x, 0);
                ctx.lineTo(x + tw / 2, th);
                ctx.lineTo(x + tw, 0);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            // bawah (di atas skyline, menghadap ke atas)
            const yb = h - 6;
            for (let x = 0; x < w; x += tw) {
                ctx.beginPath();
                ctx.moveTo(x, yb);
                ctx.lineTo(x + tw / 2, yb - th);
                ctx.lineTo(x + tw, yb);
                ctx.closePath();
                ctx.fill();
                ctx.stroke();
            }
            ctx.restore();
        }

        // ============ SKYLINE: KOTA DIGITAL + CANDI ============
        function drawSkyline(w, h, p, dark) {
            const baseY = h - 8;
            ctx.save();
            const grad = ctx.createLinearGradient(0, h - 220, 0, h);
            grad.addColorStop(0, `rgba(${p.indigo},0)`);
            grad.addColorStop(1, `rgba(${p.indigo},${dark ? 0.28 : 0.22})`);
            ctx.fillStyle = grad;

            ctx.beginPath();
            ctx.moveTo(0, baseY);
            let x = 0;
            const seed = (i) => Math.abs((Math.sin(i * 12.9898) * 43758.5453) % 1);
            let i = 0;
            while (x < w) {
                const kind = i % 7;
                if (kind === 2) {
                    // CANDI BOROBUDUR — stupa berundak
                    const cw = 90;
                    const ch = 70;
                    // dasar berundak (3 tingkat)
                    ctx.lineTo(x, baseY - ch * 0.35);
                    ctx.lineTo(x + cw * 0.1, baseY - ch * 0.35);
                    ctx.lineTo(x + cw * 0.1, baseY - ch * 0.55);
                    ctx.lineTo(x + cw * 0.22, baseY - ch * 0.55);
                    ctx.lineTo(x + cw * 0.22, baseY - ch * 0.7);
                    // stupa puncak (kubah)
                    ctx.lineTo(x + cw * 0.35, baseY - ch * 0.7);
                    ctx.lineTo(x + cw * 0.5, baseY - ch);     // puncak
                    ctx.lineTo(x + cw * 0.65, baseY - ch * 0.7);
                    ctx.lineTo(x + cw * 0.78, baseY - ch * 0.7);
                    ctx.lineTo(x + cw * 0.78, baseY - ch * 0.55);
                    ctx.lineTo(x + cw * 0.9, baseY - ch * 0.55);
                    ctx.lineTo(x + cw * 0.9, baseY - ch * 0.35);
                    ctx.lineTo(x + cw, baseY - ch * 0.35);
                    x += cw;
                } else if (kind === 5) {
                    // JOGLO — atap limasan
                    const jw = 60;
                    const jh = 45;
                    ctx.lineTo(x, baseY - jh * 0.45);
                    ctx.lineTo(x + jw * 0.18, baseY - jh * 0.45);
                    ctx.lineTo(x + jw * 0.32, baseY - jh * 0.8);
                    ctx.lineTo(x + jw * 0.5, baseY - jh);
                    ctx.lineTo(x + jw * 0.68, baseY - jh * 0.8);
                    ctx.lineTo(x + jw * 0.82, baseY - jh * 0.45);
                    ctx.lineTo(x + jw, baseY - jh * 0.45);
                    x += jw;
                } else {
                    // Gedung modern
                    const bw = 28 + seed(i) * 50;
                    const bh = 40 + seed(i + 7) * 140;
                    ctx.lineTo(x, baseY - bh);
                    if (i % 3 === 0) {
                        ctx.lineTo(x + bw * 0.5, baseY - bh - 18);
                        ctx.lineTo(x + bw * 0.5 + 1.5, baseY - bh - 18);
                        ctx.lineTo(x + bw * 0.5 + 1.5, baseY - bh);
                    }
                    ctx.lineTo(x + bw, baseY - bh);
                    x += bw;
                }
                i++;
            }
            ctx.lineTo(w, baseY);
            ctx.closePath();
            ctx.fill();
            ctx.restore();
        }

        function draw() {
            const w = canvas.offsetWidth;
            const h = canvas.offsetHeight;
            ctx.clearRect(0, 0, w, h);
            const dark = isDark();
            const p = palette(dark);
            tRef.current += 1;

            // Lapis 1: Mega Mendung (awan latar) — 3 awan tersebar
            drawMegaMendung(w * 0.18, h * 0.25, 38, dark ? 0.12 : 0.1, p);
            drawMegaMendung(w * 0.72, h * 0.18, 46, dark ? 0.1 : 0.09, p);
            drawMegaMendung(w * 0.5, h * 0.55, 32, dark ? 0.08 : 0.07, p);

            // Lapis 2: Parang diagonal
            drawParang(w, h, p, dark);

            // Lapis 3: Grid + Kawung besar di tiap titik silang
            const rect = canvas.getBoundingClientRect();
            const mx = mouseRef.current.x - rect.left;
            const my = mouseRef.current.y - rect.top;

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    const cx = c * CELL;
                    const cy = r * CELL;
                    const dx = mx - cx;
                    const dy = my - cy;
                    const dist = Math.sqrt(dx * dx + dy * dy);
                    const lit = Math.max(0, 1 - dist / 280);

                    // Grid sangat tipis (biar motif yg dominan)
                    ctx.strokeStyle = `rgba(${p.indigo},${0.04 + lit * 0.18})`;
                    ctx.lineWidth = 0.5;
                    ctx.strokeRect(cx, cy, CELL, CELL);

                    // KAWUNG BESAR di setiap titik silang
                    const baseAlpha = 0.18 + lit * 0.55;
                    drawKawung(cx, cy, 22, baseAlpha, p);

                    if (lit > 0.1) {
                        ctx.fillStyle = `rgba(${p.gold},${lit * 0.06})`;
                        ctx.fillRect(cx, cy, CELL, CELL);
                    }
                }
            }

            // Lapis 4: Tumpal border atas & bawah
            drawTumpal(w, h, p, dark);

            // Lapis 5: Partikel data emas
            particlesRef.current.forEach((q) => {
                q.x += q.vx;
                q.y += q.vy;
                q.life += 0.005;
                if (q.x < 0 || q.x > w) q.vx *= -1;
                if (q.y < 0 || q.y > h) q.vy *= -1;
                const a = 0.45 + Math.sin(q.life * 6) * 0.3;
                ctx.fillStyle = `rgba(${p.gold},${a})`;
                ctx.beginPath();
                ctx.arc(q.x, q.y, 1.6, 0, Math.PI * 2);
                ctx.fill();
                ctx.strokeStyle = `rgba(${p.gold},${a * 0.3})`;
                ctx.lineWidth = 0.6;
                ctx.beginPath();
                ctx.moveTo(q.x, q.y);
                ctx.lineTo(q.x - q.vx * 14, q.y - q.vy * 14);
                ctx.stroke();
            });

            // Lapis 6: Skyline (candi + joglo + gedung)
            drawSkyline(w, h, p, dark);

            rafRef.current = requestAnimationFrame(draw);
        }

        resize();
        draw();
        window.addEventListener("resize", resize);
        return () => {
            window.removeEventListener("resize", resize);
            if (rafRef.current) cancelAnimationFrame(rafRef.current);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            className="absolute inset-0 w-full h-full"
            style={{ display: "block" }}
        />
    );
}

<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Terima kasih atas pesan Anda</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #f1f5f9; color: #334155; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #1a4fa0, #368ce2); padding: 40px 40px 30px; text-align: center; }
        .header-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .header-icon svg { width: 32px; height: 32px; fill: white; }
        .header h1 { color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
        .header p { color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6; }
        .body { padding: 40px; }
        .greeting { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
        .text { font-size: 15px; line-height: 1.8; color: #475569; margin-bottom: 24px; }
        .card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 28px; }
        .card-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 4px; }
        .card-value { font-size: 15px; font-weight: 600; color: #1e293b; }
        .card-row { margin-bottom: 16px; }
        .card-row:last-child { margin-bottom: 0; }
        .badge { display: inline-block; background: linear-gradient(135deg, #1a4fa0, #368ce2); color: white; font-size: 12px; font-weight: 700; padding: 4px 14px; border-radius: 20px; margin-bottom: 20px; }
        .divider { border: none; border-top: 1px solid #e2e8f0; margin: 28px 0; }
        .footer-note { font-size: 13px; color: #94a3b8; line-height: 1.7; text-align: center; }
        .footer { background: #f8fafc; border-top: 1px solid #e2e8f0; padding: 24px 40px; text-align: center; }
        .footer p { font-size: 12px; color: #94a3b8; }
        .footer strong { color: #64748b; }
    </style>
</head>
<body>
    <div class="wrapper">
        <div class="header">
            <div class="header-icon">
                <svg viewBox="0 0 24 24"><path d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V6c0-1.1-.9-2-2-2zm0 4l-8 5-8-5V6l8 5 8-5v2z"/></svg>
            </div>
            <h1>Pesan Anda Telah Diterima!</h1>
            <p>Tim Nusantara Digital City akan segera merespons Anda</p>
        </div>

        <div class="body">
            <p class="greeting">Halo Kak {{ $contactData['name'] }}, 👋</p>
            <p class="text">
                Terima kasih banyak sudah menghubungi kami melalui halaman Kontak Nusantara Digital City. 
                Pesan kamu sudah masuk ke sistem kami dan sedang dalam antrean untuk dibaca oleh tim terkait.
            </p>

            <span class="badge">📋 Ringkasan Pesan Anda</span>

            <div class="card">
                <div class="card-row">
                    <p class="card-label">Nama</p>
                    <p class="card-value">{{ $contactData['name'] }}</p>
                </div>
                <div class="card-row">
                    <p class="card-label">Subjek</p>
                    <p class="card-value">{{ $contactData['subject'] }}</p>
                </div>
                <div class="card-row">
                    <p class="card-label">Pesan Anda</p>
                    <p class="card-value" style="line-height:1.7; color:#475569;">{!! nl2br(e($contactData['message'])) !!}</p>
                </div>
            </div>

            <p class="text">
                Kami biasanya merespons dalam <strong>1–2 hari kerja</strong>. Balasan akan dikirimkan langsung ke email <strong>{{ $contactData['email'] }}</strong>.
            </p>

            <hr class="divider">

            <p class="footer-note">
                Jika Anda tidak merasa mengirimkan pesan ini, abaikan saja email ini.<br>
                Salam hangat dari kami, <strong>Tim Nusantara Digital City</strong> 🌴
            </p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} <strong>Nusantara Digital City</strong>. Seluruh Hak Cipta Dilindungi.</p>
            <p style="margin-top:6px;">Email: <a href="mailto:senaguidendc@gmail.com" style="color:#368ce2;">senaguidendc@gmail.com</a></p>
        </div>
    </div>
</body>
</html>

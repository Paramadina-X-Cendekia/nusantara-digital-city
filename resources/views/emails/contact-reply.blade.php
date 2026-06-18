<!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Balasan dari Tim Nusantara Digital City</title>
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; background: #f1f5f9; color: #334155; }
        .wrapper { max-width: 600px; margin: 40px auto; background: #ffffff; border-radius: 20px; overflow: hidden; box-shadow: 0 10px 40px rgba(0,0,0,0.08); }
        .header { background: linear-gradient(135deg, #0f3d7a, #1a4fa0, #368ce2); padding: 40px 40px 30px; text-align: center; }
        .header-icon { width: 64px; height: 64px; background: rgba(255,255,255,0.15); border-radius: 50%; display: inline-flex; align-items: center; justify-content: center; margin-bottom: 16px; }
        .header-icon svg { width: 32px; height: 32px; fill: white; }
        .header h1 { color: white; font-size: 22px; font-weight: 800; letter-spacing: -0.5px; margin-bottom: 8px; }
        .header p { color: rgba(255,255,255,0.8); font-size: 14px; line-height: 1.6; }
        .body { padding: 40px; }
        .greeting { font-size: 18px; font-weight: 700; color: #1e293b; margin-bottom: 16px; }
        .text { font-size: 15px; line-height: 1.8; color: #475569; margin-bottom: 24px; }
        .reply-card { background: linear-gradient(135deg, #f0f7ff, #e8f3ff); border: 1px solid #bfdbfe; border-left: 4px solid #368ce2; border-radius: 14px; padding: 24px; margin-bottom: 28px; }
        .reply-card-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #368ce2; margin-bottom: 12px; display: flex; align-items: center; gap: 8px; }
        .reply-text { font-size: 15px; line-height: 1.9; color: #1e293b; white-space: pre-line; }
        .original-card { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 24px; margin-bottom: 28px; }
        .original-card-label { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 0.1em; color: #94a3b8; margin-bottom: 12px; }
        .original-subject { font-size: 14px; font-weight: 700; color: #334155; margin-bottom: 8px; }
        .original-message { font-size: 13px; color: #64748b; line-height: 1.7; }
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
                <svg viewBox="0 0 24 24"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>
            </div>
            <h1>Balasan dari Tim Kami</h1>
            <p>Nusantara Digital City telah merespons pesan Anda</p>
        </div>

        <div class="body">
            <p class="greeting">Halo, {{ $contactMessage->name }}! 👋</p>
            <p class="text">
                Tim Nusantara Digital City telah membaca pesan Anda dan kami dengan senang hati membalas pertanyaan atau saran yang Anda sampaikan. Berikut adalah balasan resmi dari kami:
            </p>

            <div class="reply-card">
                <p class="reply-card-label">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="#368ce2" style="flex-shrink:0"><path d="M10 9V5l-7 7 7 7v-4.1c5 0 8.5 1.6 11 5.1-1-5-4-10-11-11z"/></svg>
                    Balasan dari Admin NDC
                </p>
                <p class="reply-text">{{ $replyText }}</p>
            </div>

            <div class="original-card">
                <p class="original-card-label">📩 Pesan Asli Anda</p>
                <p class="original-subject">Subjek: {{ $contactMessage->subject }}</p>
                <p class="original-message">{!! nl2br(e($contactMessage->message)) !!}</p>
            </div>

            <hr class="divider">

            <p class="footer-note">
                Masih ada pertanyaan? Jangan ragu untuk menghubungi kami kembali melalui<br>
                <a href="mailto:senaguidendc@gmail.com" style="color:#368ce2; font-weight:700;">senaguidendc@gmail.com</a><br><br>
                Salam hangat, <strong>Tim Nusantara Digital City</strong> 🌴
            </p>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} <strong>Nusantara Digital City</strong>. Seluruh Hak Cipta Dilindungi.</p>
            <p style="margin-top:6px;">Email: <a href="mailto:senaguidendc@gmail.com" style="color:#368ce2;">senaguidendc@gmail.com</a></p>
        </div>
    </div>
</body>
</html>

<!DOCTYPE html>
<html>
<head>
    <title>Kontak Masuk: {{ $data['subject'] }}</title>
    <style>
        body { font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif; line-height: 1.6; color: #334155; max-width: 600px; margin: 0 auto; padding: 20px; }
        .header { background: #368ce2; color: white; padding: 20px; border-radius: 12px 12px 0 0; text-align: center; }
        .content { background: #f8fafc; padding: 30px; border: 1px solid #e2e8f0; border-radius: 0 0 12px 12px; }
        .field { margin-bottom: 20px; }
        .label { font-weight: bold; color: #64748b; font-size: 12px; text-transform: uppercase; letter-spacing: 0.05em; display: block; margin-bottom: 4px; }
        .value { font-size: 16px; color: #1e293b; background: white; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0; }
        .footer { text-align: center; margin-top: 20px; font-size: 12px; color: #94a3b8; }
    </style>
</head>
<body>
    <div class="header">
        <h1 style="margin: 0; font-size: 24px;">Pesan Baru dari Kontak</h1>
    </div>
    <div class="content">
        <div class="field">
            <span class="label">Nama Lengkap</span>
            <div class="value">{{ $data['name'] }}</div>
        </div>
        <div class="field">
            <span class="label">Alamat Email</span>
            <div class="value">{{ $data['email'] }}</div>
        </div>
        <div class="field">
            <span class="label">Subjek</span>
            <div class="value">{{ $data['subject'] }}</div>
        </div>
        <div class="field">
            <span class="label">Pesan</span>
            <div class="value">{!! nl2br(e($data['message'])) !!}</div>
        </div>
    </div>
    <div class="footer">
        &copy; {{ date('Y') }} Sinergi Nusa. Seluruh Hak Cipta.
    </div>
</body>
</html>

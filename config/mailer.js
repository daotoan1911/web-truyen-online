const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS
  }
});

async function sendOTP(toEmail, otp) {
  await transporter.sendMail({
    from: `"WebTruyenChu" <${process.env.MAIL_USER}>`,
    to: toEmail,
    subject: '🔐 Mã xác nhận đăng ký WebTruyenChu',
    html: `
      <div style="font-family:Arial,sans-serif;max-width:480px;margin:0 auto;background:#0f0f1a;color:#e0e0e0;border-radius:12px;overflow:hidden">
        <div style="background:#e94560;padding:24px;text-align:center">
          <h1 style="margin:0;color:#fff;font-size:22px">📖 WebTruyenChu</h1>
        </div>
        <div style="padding:32px">
          <p style="font-size:16px;margin-bottom:8px">Xin chào!</p>
          <p style="color:#aaa;margin-bottom:24px">Mã OTP xác nhận tài khoản của bạn là:</p>
          <div style="background:#1a1a2e;border:2px solid #e94560;border-radius:10px;padding:20px;text-align:center;margin-bottom:24px">
            <span style="font-size:36px;font-weight:800;letter-spacing:10px;color:#e94560">${otp}</span>
          </div>
          <p style="color:#666;font-size:13px">Mã có hiệu lực trong <b style="color:#fff">10 phút</b>. Không chia sẻ mã này với ai.</p>
          <p style="color:#444;font-size:12px;margin-top:16px">Nếu bạn không đăng ký, hãy bỏ qua email này.</p>
        </div>
      </div>`
  });
}

module.exports = { sendOTP };

import nodemailer from 'nodemailer';

// 創建郵件傳輸器
const createTransporter = () => {
  try {
    return nodemailer.createTransport({
      service: 'Gmail',
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
  } catch (error) {
    console.error('Create transporter error:', error);
    return null;
  }
};

// 發送驗證郵件
export const sendVerificationEmail = async (email, verificationToken) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error('Email transporter could not be created');
    }

    const verificationUrl = `${process.env.CLIENT_URL}/verify-email?token=${verificationToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '驗證您的電子郵件',
      html: `
        <h1>電子郵件驗證</h1>
        <p>請點擊以下連結驗證您的電子郵件：</p>
        <a href="${verificationUrl}">驗證電子郵件</a>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Verification email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Send verification email error:', error);
    return false;
  }
};

// 發送重置密碼郵件
export const sendResetPasswordEmail = async (email, resetToken) => {
  try {
    const transporter = createTransporter();
    if (!transporter) {
      throw new Error('Email transporter could not be created');
    }

    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: '重置密碼請求',
      html: `
        <h1>重置密碼</h1>
        <p>您收到這封郵件是因為您（或其他人）請求重置密碼。</p>
        <p>請點擊以下連結重置密碼：</p>
        <a href="${resetUrl}">重置密碼</a>
        <p>如果您沒有請求重置密碼，請忽略此郵件。</p>
        <p>此連結將在一小時後失效。</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log('Reset password email sent:', info.messageId);
    return true;
  } catch (error) {
    console.error('Reset password email error:', error);
    return false;
  }
};

export default {
  sendVerificationEmail,
  sendResetPasswordEmail,
};

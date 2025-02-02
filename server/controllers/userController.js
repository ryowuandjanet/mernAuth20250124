import User from '../models/userModel.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
import crypto from 'crypto';

dotenv.config();

// 首先確保環境變數被正確載入
console.log('Email configuration:', {
  user: process.env.EMAIL_USER ? 'Set' : 'Not set',
  pass: process.env.EMAIL_PASS ? 'Set' : 'Not set',
});

// 更新 transporter 設置
const transporter = nodemailer.createTransport({
  service: 'gmail',
  host: 'smtp.gmail.com',
  port: 587,
  secure: false,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  debug: true, // 啟用調試
  logger: true, // 啟用日誌
});

const generateVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// 在發送郵件之前添加驗證
const verifyTransporter = async () => {
  try {
    await transporter.verify();
    console.log('SMTP connection verified successfully');
    return true;
  } catch (error) {
    console.error('SMTP verification failed:', error);
    return false;
  }
};

// 生成 Token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

// 註冊用戶
const registerUser = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // 檢查用戶是否已存在
    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ message: '用戶已存在' });
    }

    // 生成驗證碼
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationCodeExpiry = new Date(Date.now() + 30 * 60 * 1000); // 30分鐘後過期

    // 創建用戶
    const user = await User.create({
      name,
      email,
      password,
      verificationCode,
      verificationCodeExpiry,
    });

    if (user) {
      // 在這裡添加發送驗證郵件的邏輯
      // await sendVerificationEmail(email, verificationCode);

      res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        isVerified: user.isVerified,
      });
    }
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ message: '註冊失敗' });
  }
};

// 用戶登入
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log('Login attempt:', { email }); // 添加日誌

    // 查找用戶
    const user = await User.findOne({ email });
    console.log('User found:', user ? 'Yes' : 'No'); // 添加日誌

    if (!user) {
      return res.status(401).json({ message: '郵箱或密碼不正確' });
    }

    // 檢查密碼
    const isMatch = await bcrypt.compare(password, user.password);
    console.log('Password match:', isMatch ? 'Yes' : 'No'); // 添加日誌

    if (isMatch) {
      // 登入成功
      res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: generateToken(user._id),
        isVerified: user.isVerified,
      });
    } else {
      res.status(401).json({ message: '郵箱或密碼不正確' });
    }
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: '登入失敗' });
  }
};

// 驗證郵件
const verifyEmail = async (req, res) => {
  try {
    const { email, verificationCode } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }

    if (user.verificationCodeExpiry < new Date()) {
      return res.status(400).json({ message: '驗證碼已過期' });
    }

    if (user.verificationCode !== verificationCode) {
      return res.status(400).json({ message: '驗證碼不正確' });
    }

    // 更新為 isVerified
    user.isVerified = true;
    user.verificationCode = undefined;
    user.verificationCodeExpiry = undefined;
    await user.save();

    res.json({
      message: '郵件驗證成功',
      user: {
        _id: user._id,
        name: user.name,
        email: user.email,
        isVerified: user.isVerified,
      },
    });
  } catch (error) {
    console.error('Verification error:', error);
    res.status(500).json({ message: '驗證失敗' });
  }
};

// 重新發送驗證碼
const resendVerification = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: '用戶不存在' });
    }

    if (user.verified) {
      return res.status(400).json({ message: '用戶已驗證' });
    }

    // 生成新的驗證碼
    const verificationCode = Math.floor(
      100000 + Math.random() * 900000,
    ).toString();
    const verificationCodeExpiry = new Date(Date.now() + 30 * 60 * 1000);

    user.verificationCode = verificationCode;
    user.verificationCodeExpiry = verificationCodeExpiry;
    await user.save();

    // 在這裡添加發送驗證郵件的邏輯
    // await sendVerificationEmail(email, verificationCode);

    // 在開發環境下返回驗證碼
    if (process.env.NODE_ENV === 'development') {
      res.json({
        message: '驗證碼已重新發送',
        verificationCode,
      });
    } else {
      res.json({ message: '驗證碼已重新發送' });
    }
  } catch (error) {
    console.error('Resend verification error:', error);
    res.status(500).json({ message: '重新發送驗證碼失敗' });
  }
};

// 發送驗證碼
export const sendVerificationCode = async (email) => {
  // 生成6位數驗證碼
  const verificationCode = Math.floor(
    100000 + Math.random() * 900000,
  ).toString();

  // 設置驗證碼過期時間（例如：30分鐘）
  const codeExpiry = new Date(Date.now() + 30 * 60 * 1000);

  try {
    // 更新用戶的驗證碼和過期時間
    await User.findOneAndUpdate(
      { email },
      {
        verificationCode,
        verificationCodeExpiry: codeExpiry,
      },
    );

    // 這裡添加發送郵件的邏輯
    // await sendEmail(email, verificationCode);

    return verificationCode;
  } catch (error) {
    console.error('Error sending verification code:', error);
    throw error;
  }
};

// 生成重置密碼的 token
const generateResetToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// 忘記密碼
const forgotPassword = async (req, res) => {
  try {
    console.log('Forgot password request received:', req.body);
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: '請提供電子郵件地址' });
    }

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(404).json({ message: '此電子郵件未註冊' });
    }

    // 生成重置密碼的 token 和過期時間
    const resetToken = generateResetToken();
    const resetTokenExpires = new Date(Date.now() + 30 * 60000); // 30 分鐘後過期

    // 更新用戶的重置密碼信息
    user.resetPasswordToken = resetToken;
    user.resetPasswordExpires = resetTokenExpires;
    await user.save();

    // 重置密碼的連結
    const resetUrl = `${process.env.CLIENT_URL}/reset-password/${resetToken}`;

    // 發送重置密碼郵件
    const mailOptions = {
      from: {
        name: '密碼重置',
        address: process.env.EMAIL_USER,
      },
      to: email,
      subject: '密碼重置請求',
      html: `
        <div style="padding: 20px; background-color: #f5f5f5;">
          <div style="background-color: white; padding: 20px; border-radius: 10px;">
            <h2 style="color: #4F46E5; margin-bottom: 20px;">密碼重置請求</h2>
            <p style="font-size: 16px; color: #333;">親愛的用戶：</p>
            <p style="font-size: 16px; color: #333;">我們收到了您的密碼重置請求。請點擊下方連結重置您的密碼：</p>
            <div style="margin: 30px 0; text-align: center;">
              <a href="${resetUrl}" 
                 style="background-color: #4F46E5; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; display: inline-block;">
                重置密碼
              </a>
            </div>
            <p style="font-size: 14px; color: #666;">
              • 此連結將在 30 分鐘後過期<br>
              • 如果這不是您的操作，請忽略此郵件
            </p>
          </div>
        </div>
      `,
    };

    try {
      await transporter.verify();
      console.log('SMTP connection verified');

      const info = await transporter.sendMail(mailOptions);
      console.log('Password reset email sent:', info.response);

      res.json({
        message: '重置密碼郵件已發送',
        success: true,
      });
    } catch (emailError) {
      console.error('Email sending failed:', emailError);
      res.status(500).json({
        message: '發送重置密碼郵件失敗',
        error: emailError.message,
      });
    }
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      message: '處理忘記密碼請求失敗',
      error: error.message,
    });
  }
};

// 重置密碼
const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: '缺少必要參數' });
    }

    const user = await User.findOne({
      resetPasswordToken: token,
      resetPasswordExpires: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ message: '重置密碼連結無效或已過期' });
    }

    // 更新密碼
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);
    user.resetPasswordToken = undefined;
    user.resetPasswordExpires = undefined;
    await user.save();

    res.json({ message: '密碼重置成功' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({
      message: '重置密碼失敗',
      error: error.message,
    });
  }
};

// 在啟動服務器時驗證 transporter
transporter.verify(function (error, success) {
  if (error) {
    console.error('Transporter verification failed:', error);
  } else {
    console.log('Server is ready to send emails');
  }
});

export {
  registerUser,
  loginUser,
  verifyEmail,
  resendVerification,
  forgotPassword,
  resetPassword,
};

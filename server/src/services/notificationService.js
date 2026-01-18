const nodemailer = require('nodemailer');
const admin = require('firebase-admin');
const path = require('path');

let transporter;

const initTransporter = () => {
  if (transporter) return transporter;

  const {
    SMTP_HOST,
    SMTP_PORT,
    SMTP_USER,
    SMTP_PASS,
    SMTP_SECURE,
  } = process.env;

  if (SMTP_HOST && SMTP_PORT && SMTP_USER && SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: Number(SMTP_PORT),
      secure: SMTP_SECURE === 'true',
      auth: {
        user: SMTP_USER,
        pass: SMTP_PASS,
      },
    });
  }

  return transporter;
};

const initialiseFirebase = () => {
  if (admin.apps.length > 0) return admin.app();

  const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT;

  if (serviceAccountPath) {
    const resolvedPath = path.resolve(serviceAccountPath);
    // eslint-disable-next-line global-require, import/no-dynamic-require
    const serviceAccount = require(resolvedPath);

    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount),
    });
  }

  return admin.app();
};

const sendEmail = async ({ to, subject, html }) => {
  const mailTransporter = initTransporter();
  if (!mailTransporter) {
    console.log('Email transport not configured. Email payload:', { to, subject });
    return;
  }

  await mailTransporter.sendMail({
    from: process.env.SMTP_FROM || '"Fitness Tracker" <noreply@fittrack.app>',
    to,
    subject,
    html,
  });
};

const sendPasswordResetEmail = async (user, resetToken) => {
  const resetLink = `${process.env.CLIENT_ORIGIN || 'http://localhost:5173'}/reset-password?token=${resetToken}`;
  const html = `
    <p>Hi ${user.name},</p>
    <p>We received a request to reset your password. Click the link below to proceed:</p>
    <p><a href="${resetLink}">Reset your password</a></p>
    <p>If you did not request this, you can safely ignore this email.</p>
  `;

  await sendEmail({
    to: user.email,
    subject: 'Reset your Fitness Tracker password',
    html,
  });
};

const sendGoalReminderEmail = async (user, goal) => {
  const html = `
    <p>Hi ${user.name},</p>
    <p>You are ${Math.max(goal.targetValue - goal.currentValue, 0)} ${goal.unit} away from completing your goal "${goal.title}".</p>
    <p>Keep up the great work!</p>
  `;

  await sendEmail({
    to: user.email,
    subject: `Goal reminder: ${goal.title}`,
    html,
  });
};

const sendPushNotification = async (tokens, notification) => {
  if (!tokens || tokens.length === 0) return;

  try {
    initialiseFirebase();
  } catch (error) {
    console.warn('Firebase not initialised. Skipping push notification.');
    return;
  }

  const message = {
    tokens,
    notification,
  };

  await admin.messaging().sendEachForMulticast(message);
};

module.exports = {
  sendPasswordResetEmail,
  sendGoalReminderEmail,
  sendPushNotification,
};

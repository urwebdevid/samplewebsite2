const express = require('express');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.static('public'));

// Root route – serves homepage
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Email configuration – reads credentials from Render environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

// Handle enrollment form submission
app.post('/api/enroll', async (req, res) => {
  const { weight, height, age, targetWeight, email } = req.body;

  if (!weight || !height || !age || !targetWeight || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: `"Macho Muscles" <${process.env.EMAIL_USER}>`,
    to: process.env.EMAIL_TO,
    subject: '🔥 NEW CLIENT CONDITION ENROLLMENT 🔥',
    html: `
      <h2>New Macho Muscles client request</h2>
      <ul>
        <li><strong>Current weight:</strong> ${weight} kg</li>
        <li><strong>Height:</strong> ${height} cm</li>
        <li><strong>Age:</strong> ${age}</li>
        <li><strong>Target weight:</strong> ${targetWeight} kg</li>
        <li><strong>Gmail address for diet:</strong> ${email}</li>
      </ul>
      <p>Contact the client ASAP to schedule a consultation.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    res.redirect('/success.html');
  } catch (error) {
    console.error('Email error:', error);
    res.status(500).send('Server error – could not send notification.');
  }
});

// Start the server
app.listen(PORT, () => {
  console.log(`✅ Macho Muscles server running on port ${PORT}`);
});

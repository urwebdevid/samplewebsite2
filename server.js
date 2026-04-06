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

// Email configuration (replace with real credentials for production)
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'owner-of-gym-mail@gmail.com', // <-- CHANGE TO OWNER'S EMAIL
    pass: 'yourmail-app-password'                // <-- USE GMAIL APP PASSWORD
  }
});

// Endpoint to handle form submission
app.post('/api/enroll', async (req, res) => {
  const { weight, height, age, targetWeight, email } = req.body;

  if (!weight || !height || !age || !targetWeight || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  // Email to gym owner
  const mailOptions = {
    from: 'youremail@gmail.com',
    to: 'owner@gmail.com',        // <-- GYM OWNER'S REAL EMAIL
    subject: '🔥 NEW CLIENT CONDITION ENROLLMENT 🔥',
    html: `
      <h2>New Macho Muscles client request</h2>
      <ul>
        <li><strong>Current weight:</strong> ${weight} kg</li>
        <li><strong>Height:</strong> ${height} cm</li>
        <li><strong>Age:</strong> ${age}</li>
        <li><strong>Target weight:</strong> ${targetWeight} kg</li>
        <li><strong>Gmail address:</strong> ${email}</li>
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

app.listen(PORT, () => {
  console.log(`✅ Macho Muscles server running on http://localhost:${PORT}`);
});
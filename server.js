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

// Root route - serves index.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Email configuration
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER || 'owner-of-gym-mail@gmail.com',
    pass: process.env.EMAIL_PASS || 'yourmail-app-password'
  }
});

// Endpoint to handle form submission
app.post('/api/enroll', async (req, res) => {
  const { weight, height, age, targetweight, email } = req.body;

  if (!weight || !height || !age || !targetweight || !email) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const mailOptions = {
    from: `"Macho Muscles" <${process.env.EMAIL_USER || 'owner-of-gym-mail@gmail.com'}>`,
    to: 'nakul2ff07@gmail.com',  // CHANGE THIS to the gym owner's email
    subject: '🔥 NEW CLIENT CONDITION ENROLLMENT 🔥',
    html: `
      <h2>New Macho Muscles client request</h2>
      <ul>
        <li><strong>Current weight:</strong> ${weight} kg</li>
        <li><strong>Height:</strong> ${height} cm</li>
        <li><strong>Age:</strong> ${age}</li>
        <li><strong>Target weight:</strong> ${targetweight} kg</li>
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

app.listen(PORT, () => {
  console.log(`✅ Macho Muscles server running on port ${PORT}`);
});

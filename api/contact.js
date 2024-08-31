const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Create an Express app
const app = express();

// Middleware to parse JSON bodies
app.use(express.json());

// Middleware to handle CORS
app.use(cors({
  origin: '*', 
}));

// MongoDB connection
const mongoUri = 'mongodb+srv://nikhilchaudhary390:8zpCwsJFOrDOSOt5@userscluster.xnqvw.mongodb.net/?retryWrites=true&w=majority';

mongoose.connect(mongoUri, {
  dbName: 'Personal', // Database name should be a string
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
  .then(() => console.log('Connected to MongoDB'))
  .catch(err => console.error('Failed to connect to MongoDB:', err));

// Define a Mongoose schema and model
const contactSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  phone: { type: String, required: true },
  message: { type: String, required: true },
});

const Contact = mongoose.model('Contact', contactSchema);

// POST route to handle form submissions
app.post('/api/contact', async (req, res) => {
  const { firstName, lastName, email, phone, message } = req.body;

  const errors = {};

  if (!firstName) errors.firstName = 'First name is required';
  if (!lastName) errors.lastName = 'Last name is required';
  if (!email) errors.email = 'Email is required';
  if (!phone) errors.phone = 'Phone number is required';
  if (!message) errors.message = 'Message is required';

  if (Object.keys(errors).length > 0) {
    return res.status(400).json({ errors });
  }

  try {
    const newContact = new Contact({ firstName, lastName, email, phone, message });

    await newContact.save();

    res.status(201).json({ message: 'Contact information saved successfully!' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to save contact information' });
  }
});

// GET route to fetch all contact data
app.get('/api/contact', async (req, res) => {
  try {
    const contacts = await Contact.find();
    res.status(200).json(contacts);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch contact information' });
  }
});

// Export the serverless function
module.exports = app;

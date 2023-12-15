// models/goals.js
const mongoose = require('mongoose');

const goalsSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  goalName: { type: String, required: true },
  description: { type: String },
  targetDate: { type: Date },
  userId: { type: String, required: true },
  
});

const Goals = mongoose.model('Goals', goalsSchema, 'Goals');

module.exports = Goals;

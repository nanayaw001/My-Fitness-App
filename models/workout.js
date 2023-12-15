// models/workout.js
const mongoose = require('mongoose');

const workoutSchema = new mongoose.Schema({
  _id: { type: String }, 
  duration: { type: Number, required: true },
  intensity: { type: String, required: true },
  notes: { type: String }, 
  date: { type: Date, default: Date.now },
  userId: { type: String },
  
});



const Workout = mongoose.model('Workout', workoutSchema, 'Workouts');

module.exports = Workout;

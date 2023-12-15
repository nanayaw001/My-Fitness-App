// Import the Mongoose library for MongoDB interactions
const mongoose = require('mongoose');

// Define the schema for the 'achievements' collection
const achievementSchema = new mongoose.Schema({
  _id: { type: String, required: true },  
  achievementName: { type: String, required: true },  
  dateAchieved: { type: Date, default: Date.now },  
  userId: { type: String, required: true },  
});

// Create a Mongoose model named 'Achievement' based on the defined schema,
// and specify that it corresponds to the 'Achievements' collection in MongoDB
const Achievement = mongoose.model('Achievement', achievementSchema, 'Achievements');

// Export the 'Achievement' model to make it available for use in other parts of the application
module.exports = Achievement;

// models/social.js
const mongoose = require('mongoose');

const socialSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  postText: { type: String, required: true },
  authorId: { type: String, required: true },
  datePosted: { type: Date, default: Date.now }, 
  
});

const Social = mongoose.model('Social', socialSchema, 'Social');

module.exports = Social;

const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String }, 
  username: { type: String, required: true, unique: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  
});

const User = mongoose.model('User', userSchema, 'Users');

module.exports = User;

// models/nutrition.js

const mongoose = require('mongoose');

const foodSchema = new mongoose.Schema({
  foodName: { type: String, required: true },
  quantity: { type: Number, required: true },
  calories: { type: Number, required: true }, 
  
});

const nutritionSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  foodsConsumed: [foodSchema], 
  date: { type: Date, required: true }, 
  userId: { type: String, required: true },
  
  
});

const Nutrition = mongoose.model('Nutrition', nutritionSchema, 'Nutrition');

module.exports = Nutrition;


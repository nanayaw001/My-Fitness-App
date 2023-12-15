// models/metrics.js
const mongoose = require('mongoose');

const metricsSchema = new mongoose.Schema({
  _id: { type: String, required: true },
  metricName: { type: String, required: true },
  value: { type: Number, required: true },
  date: { type: Date, default: Date.now },
  userId: { type: String, required: true },
  
});

const Metrics = mongoose.model('Metrics', metricsSchema, 'Metrics');

module.exports = Metrics;

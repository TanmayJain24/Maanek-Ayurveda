const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema({
  slug: { type: String, required: true, unique: true },
  title: String,
  subtitle: String,
  description: String,
  pricing: String,
  heroImage: String,
  duration: String,
  suitability: {
    heading: String,
    idealFor: [String],
    notRecommendedFor: [String],
  },
  features: [
    {
      icon: String,
      title: String,
      detail: String,
    },
  ],
  benefits: [
    {
      category: String,
      icon: String,
      items: [String],
    },
  ],
  steps: [
    {
      title: String,
      description: String,
    },
  ],
  aftercare: [String],
  faqs: [
    {
      question: String,
      answer: String,
    },
  ],
  cta: {
    heading: String,
    subheading: String,
  },
});

module.exports = mongoose.model("Service", serviceSchema);
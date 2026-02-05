/**
 * Controllers Index
 * Central export for all route controllers
 */

const stripeController = require('./stripe');
const aiController = require('./ai');

module.exports = {
  stripe: stripeController,
  ai: aiController,
};

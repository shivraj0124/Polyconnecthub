const mongoose = require('mongoose');

const subscriberSchema = new mongoose.Schema({
  collegeId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'College',
    required: true,
  },
  subscribers: [
    {
      studentId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Auth',
        required: true
      },
      subscribedDate: {
        type: Date,
        default: Date.now
      }
    }
  ]
});

module.exports = mongoose.model('Subscribers', subscriberSchema);

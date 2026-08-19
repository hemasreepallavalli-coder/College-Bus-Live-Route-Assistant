const mongoose = require("mongoose");

const stopSchema = new mongoose.Schema(
  {
    stopName: {
      type: String,
      required: true
    },

    routeName: {
      type: String,
      required: true
    },

    latitude: {
      type: Number,
      required: true
    },

    longitude: {
      type: Number,
      required: true
    },

    stopOrder: {
      type: Number,
      required: true
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Stop", stopSchema);
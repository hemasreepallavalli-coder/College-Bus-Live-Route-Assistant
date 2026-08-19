const mongoose = require("mongoose");

const routeSchema = new mongoose.Schema(
  {
    routeName: {
      type: String,
      required: true,
      unique: true
    },

    startPoint: {
      type: String,
      required: true
    },

    destination: {
      type: String,
      required: true
    },

    stops: {
      type: [String],
      default: []
    },

    status: {
      type: String,
      enum: ["Active", "Inactive"],
      default: "Active"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Route", routeSchema);
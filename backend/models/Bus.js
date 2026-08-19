const mongoose = require("mongoose");

const busSchema = new mongoose.Schema(
  {
    busNumber: {
      type: String,
      required: true,
      unique: true
    },

    registrationNumber: {
      type: String,
      required: true,
      unique: true
    },

    driverName: {
      type: String,
      required: true
    },

    routeName: {
      type: String,
      required: true
    },

    status: {
      type: String,
      enum: ["Active", "Inactive", "Maintenance"],
      default: "Inactive"
    }
  },
  {
    timestamps: true
  }
);

module.exports = mongoose.model("Bus", busSchema);
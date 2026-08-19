const express = require("express");
const router = express.Router();

const Stop = require("../models/Stop");

// GET all stops
router.get("/", async (req, res) => {
  try {
    const stops = await Stop.find();
    res.json(stops);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one stop
router.get("/:id", async (req, res) => {
  try {
    const stop = await Stop.findById(req.params.id);

    if (!stop) {
      return res.status(404).json({ message: "Stop not found" });
    }

    res.json(stop);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD a stop
router.post("/", async (req, res) => {
  try {
    const stop = new Stop({
      stopName: req.body.stopName,
      routeName: req.body.routeName,
      latitude: req.body.latitude,
      longitude: req.body.longitude,
      stopOrder: req.body.stopOrder
    });

    const savedStop = await stop.save();

    res.status(201).json(savedStop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a stop
router.put("/:id", async (req, res) => {
  try {
    const updatedStop = await Stop.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedStop) {
      return res.status(404).json({ message: "Stop not found" });
    }

    res.json(updatedStop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a stop
router.delete("/:id", async (req, res) => {
  try {
    const deletedStop = await Stop.findByIdAndDelete(req.params.id);

    if (!deletedStop) {
      return res.status(404).json({ message: "Stop not found" });
    }

    res.json({ message: "Stop deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
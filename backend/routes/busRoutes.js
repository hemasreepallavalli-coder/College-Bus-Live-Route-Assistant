const express = require("express");
const router = express.Router();

const Bus = require("../models/Bus");

// GET all buses
router.get("/", async (req, res) => {
  try {
    const buses = await Bus.find();
    res.json(buses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one bus
router.get("/:id", async (req, res) => {
  try {
    const bus = await Bus.findById(req.params.id);

    if (!bus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(bus);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD a new bus
router.post("/", async (req, res) => {
  try {
    const bus = new Bus({
      busNumber: req.body.busNumber,
      registrationNumber: req.body.registrationNumber,
      driverName: req.body.driverName,
      routeName: req.body.routeName,
      status: req.body.status
    });

    const savedBus = await bus.save();

    res.status(201).json(savedBus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE a bus
router.put("/:id", async (req, res) => {
  try {
    const updatedBus = await Bus.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json(updatedBus);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE a bus
router.delete("/:id", async (req, res) => {
  try {
    const deletedBus = await Bus.findByIdAndDelete(req.params.id);

    if (!deletedBus) {
      return res.status(404).json({ message: "Bus not found" });
    }

    res.json({ message: "Bus deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
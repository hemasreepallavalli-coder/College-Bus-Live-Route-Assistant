const express = require("express");
const router = express.Router();

const Route = require("../models/Route");

// GET all routes
router.get("/", async (req, res) => {
  try {
    const routes = await Route.find();
    res.json(routes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// GET one route
router.get("/:id", async (req, res) => {
  try {
    const route = await Route.findById(req.params.id);

    if (!route) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json(route);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// ADD route
router.post("/", async (req, res) => {
  try {
    const route = new Route({
      routeName: req.body.routeName,
      startPoint: req.body.startPoint,
      destination: req.body.destination,
      stops: req.body.stops || [],
      status: req.body.status
    });

    const savedRoute = await route.save();

    res.status(201).json(savedRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// UPDATE route
router.put("/:id", async (req, res) => {
  try {
    const updatedRoute = await Route.findByIdAndUpdate(
      req.params.id,
      req.body,
      {
        new: true,
        runValidators: true
      }
    );

    if (!updatedRoute) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json(updatedRoute);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// DELETE route
router.delete("/:id", async (req, res) => {
  try {
    const deletedRoute = await Route.findByIdAndDelete(req.params.id);

    if (!deletedRoute) {
      return res.status(404).json({ message: "Route not found" });
    }

    res.json({ message: "Route deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
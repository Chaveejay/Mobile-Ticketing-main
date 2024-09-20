const EventPlan = require('../models/EventPlan');

exports.createEventPlan = async (req, res) => {
    try {
        const eventPlan = new EventPlan(req.body);
        await eventPlan.save();
        res.status(201).json(eventPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getAllEventPlans = async (req, res) => {
    try {
        const eventPlans = await EventPlan.find();
        res.status(200).json(eventPlans);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.getEventPlanById = async (req, res) => {
    try {
        const eventPlan = await EventPlan.findById(req.params.id);
        if (!eventPlan) return res.status(404).json({ message: "Event Plan not found" });
        res.status(200).json(eventPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.updateEventPlan = async (req, res) => {
    try {
        const eventPlan = await EventPlan.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!eventPlan) return res.status(404).json({ message: "Event Plan not found" });
        res.status(200).json(eventPlan);
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

exports.deleteEventPlan = async (req, res) => {
    try {
        const eventPlan = await EventPlan.findByIdAndDelete(req.params.id);
        if (!eventPlan) return res.status(404).json({ message: "Event Plan not found" });
        res.status(200).json({ message: "Event Plan deleted successfully" });
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
};

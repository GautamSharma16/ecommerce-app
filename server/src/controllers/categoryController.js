import Category from '../models/Category.js';
import { validationResult } from 'express-validator';

// Get all categories
export const getCategories = async (req, res) => {
    try {
        const categories = await Category.find({}).sort({ name: 1 });
        res.json(categories);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Create a new category (Admin)
export const createCategory = async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

        const { name, description, image } = req.body;

        const existingCategory = await Category.findOne({ name });
        if (existingCategory) {
            return res.status(400).json({ message: 'Category already exists' });
        }

        const category = await Category.create({ name, description, image });
        res.status(201).json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Update a category (Admin)
export const updateCategory = async (req, res) => {
    try {
        const { name, description, image, isActive } = req.body;

        // Check if new name already exists elsewhere
        if (name) {
            const existing = await Category.findOne({ name, _id: { $ne: req.params.id } });
            if (existing) {
                return res.status(400).json({ message: 'Category name already exists' });
            }
        }

        const category = await Category.findById(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });

        category.name = name || category.name;
        if (description !== undefined) category.description = description;
        if (image !== undefined) category.image = image;
        if (isActive !== undefined) category.isActive = isActive;

        await category.save();

        res.json(category);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

// Delete a category (Admin)
export const deleteCategory = async (req, res) => {
    try {
        const category = await Category.findByIdAndDelete(req.params.id);
        if (!category) return res.status(404).json({ message: 'Category not found' });
        res.json({ message: 'Category deleted successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: err.message });
    }
};

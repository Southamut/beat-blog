import express from "express";
import supabase from "../utils/supabase.js";
import protectAdmin from "./middlewares/protectAdmin.mjs";

const router = express.Router();

// GET /categories - Fetch all categories
router.get("/", async (req, res) => {
    try {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) {
            console.error('Database error:', error);
            console.error('Error details:', error.message);

            // If categories table doesn't exist, return mock data for development
            if (error.message.includes('relation "categories" does not exist') ||
                error.message.includes('table "categories" does not exist')) {
                console.log('Categories table not found, returning mock data');
                const mockCategories = [
                    { id: 1, name: "Fishing Tips" },
                    { id: 2, name: "Equipment Reviews" },
                    { id: 3, name: "Fishing Spots" },
                    { id: 4, name: "Species Guide" },
                    { id: 5, name: "Techniques" }
                ];
                return res.status(200).json(mockCategories);
            }

            return res.status(500).json({
                message: "Server could not read categories because database connection",
                error: error.message
            });
        }

        // If no data returned, return mock data
        if (!data || data.length === 0) {
            console.log('No categories found, returning mock data');
            const mockCategories = [
                { id: 1, name: "Fishing Tips" },
                { id: 2, name: "Equipment Reviews" },
                { id: 3, name: "Fishing Spots" },
                { id: 4, name: "Species Guide" },
                { id: 5, name: "Techniques" }
            ];
            return res.status(200).json(mockCategories);
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Server error:', error);
        // Return mock data on any server error for development
        console.log('Server error occurred, returning mock categories data');
        const mockCategories = [
            { id: 1, name: "Fishing Tips" },
            { id: 2, name: "Equipment Reviews" },
            { id: 3, name: "Fishing Spots" },
            { id: 4, name: "Species Guide" },
            { id: 5, name: "Techniques" }
        ];
        return res.status(200).json(mockCategories);
    }
});

// GET /categories/:id - Fetch single category
router.get("/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('id', id)
            .single();

        if (error) {
            console.error('Database error:', error);

            // If categories table doesn't exist, return mock data for development
            if (error.message.includes('relation "categories" does not exist') ||
                error.message.includes('table "categories" does not exist')) {
                console.log('Categories table not found, returning mock data');
                const mockCategories = [
                    { id: 1, name: "Fishing Tips" },
                    { id: 2, name: "Equipment Reviews" },
                    { id: 3, name: "Fishing Spots" },
                    { id: 4, name: "Species Guide" },
                    { id: 5, name: "Techniques" }
                ];
                const category = mockCategories.find(cat => cat.id === parseInt(id));
                if (category) {
                    return res.status(200).json(category);
                } else {
                    return res.status(404).json({ message: 'Category not found' });
                }
            }

            return res.status(500).json({
                message: "Server could not read category because database connection",
                error: error.message
            });
        }

        if (!data) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Server error:', error);

        // Return mock data for development
        console.log('Server error occurred, returning mock category data');
        const mockCategories = [
            { id: 1, name: "Fishing Tips" },
            { id: 2, name: "Equipment Reviews" },
            { id: 3, name: "Fishing Spots" },
            { id: 4, name: "Species Guide" },
            { id: 5, name: "Techniques" }
        ];
        const category = mockCategories.find(cat => cat.id === parseInt(req.params.id));
        if (category) {
            return res.status(200).json(category);
        } else {
            return res.status(404).json({ message: 'Category not found' });
        }
    }
});

// POST /categories - Create new category
router.post("/", protectAdmin , async (req, res) => {
    try {
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const { data, error } = await supabase
            .from('categories')
            .insert([{ name: name.trim() }])
            .select()
            .single();

        if (error) throw error;

        return res.status(201).json(data);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: "Server could not create category because database connection",
            error: error.message
        });
    }
});

// PUT /categories/:id - Update category
router.put("/:id", protectAdmin , async (req, res) => {
    try {
        const { id } = req.params;
        const { name } = req.body;

        if (!name || name.trim() === '') {
            return res.status(400).json({
                message: "Category name is required"
            });
        }

        const { data, error } = await supabase
            .from('categories')
            .update({ name: name.trim() })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json(data);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: "Server could not update category because database connection",
            error: error.message
        });
    }
});

// DELETE /categories/:id - Delete category
router.delete("/:id", protectAdmin , async (req, res) => {
    try {
        const { id } = req.params;

        const { data, error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;

        if (!data) {
            return res.status(404).json({ message: 'Category not found' });
        }

        return res.status(200).json({
            message: 'Category deleted successfully',
            data
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: "Server could not delete category because database connection",
            error: error.message
        });
    }
});

export default router;

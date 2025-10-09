import express from "express";
import supabase from "../utils/supabase.js";

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

export default router;

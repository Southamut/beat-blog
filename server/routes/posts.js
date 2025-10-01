import express from "express";
import supabase from "../utils/supabase.js";

const router = express.Router();

// POST /posts - User สามารถสร้างบทความใหม่ขึ้นมาได้ในระบบ
router.post("/", async (req, res) => {
    try {
        const { title, image, category_id } = req.body;

        // Check if required data is provided
        if (!title || !image || !category_id) {
            return res.status(400).json({
                message: "Server could not create post because there are missing data from client"
            });
        }

        // Insert new post into database
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title: title,
                    image: image,
                    category_id: category_id
                }
            ])
            .select();

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({
                message: "Server could not create post because database connection"
            });
        }

        return res.status(201).json({
            message: "Created post sucessfully"
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: "Server could not create post because database connection"
        });
    }
});

export default router;

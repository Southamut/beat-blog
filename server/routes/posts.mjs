import express from "express";
import supabase from "../utils/supabase.js";
import { validatePostDataSingle } from "../middleware/validation.mjs";

const router = express.Router();

// GET /posts - นักเขียนสามารถดูข้อมูลบทความทั้งหมดในระบบได้
router.get("/", async (req, res) => {
    try {
        const { page = 1, limit = 6, category, keyword } = req.query;
        const offset = (page - 1) * limit;

        let query = supabase.from('posts').select('*', { count: 'exact' });

        // Filter by category if provided
        if (category) {
            query = query.eq('category', category);
        }

        // Search by keyword if provided
        if (keyword) {
            query = query.or(`title.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`);
        }

        // Add pagination
        query = query.range(offset, offset + limit - 1);

        const { data: posts, error, count } = await query;

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({
                message: "Server could not read post because database connection"
            });
        }

        const totalPages = Math.ceil(count / limit);
        const nextPage = page < totalPages ? parseInt(page) + 1 : null;

        return res.status(200).json({
            totalPosts: count,
            totalPages: totalPages,
            currentPage: parseInt(page),
            limit: parseInt(limit),
            posts: posts,
            nextPage: nextPage
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: "Server could not read post because database connection"
        });
    }
});

// GET /posts/:postId - นักเขียนสามารถดูข้อมูลบทความอันเดียวได้
router.get("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        const { data: post, error } = await supabase
            .from('posts')
            .select('*')
            .eq('id', postId)
            .single();

        if (error || !post) {
            return res.status(404).json({
                message: "Server could not find a requested post"
            });
        }

        return res.status(200).json(post);

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: "Server could not read post because database connection"
        });
    }
});

// POST /posts - User สามารถสร้างบทความใหม่ขึ้นมาได้ในระบบ (with validation)
router.post("/", validatePostDataSingle, async (req, res) => {
    try {
        const { title, image, category_id, description, content, status_id } = req.body;

        // Insert new post into database
        const { data, error } = await supabase
            .from('posts')
            .insert([
                {
                    title: title,
                    image: image,
                    category_id: category_id,
                    description: description,
                    content: content,
                    status_id: status_id
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

// PUT /posts/:postId - นักเขียนสามารถแก้ไขบทความที่ได้เคยสร้างไว้ก่อนหน้านี้ (with validation)
router.put("/:postId", validatePostDataSingle, async (req, res) => {
    try {
        const { postId } = req.params;
        const { title, image, category_id, description, content, status_id } = req.body;

        // Check if post exists first
        const { data: existingPost, error: checkError } = await supabase
            .from('posts')
            .select('id')
            .eq('id', postId)
            .single();

        if (checkError || !existingPost) {
            return res.status(404).json({
                message: "Server could not find a requested post to update"
            });
        }

        // Update the post
        const { data, error } = await supabase
            .from('posts')
            .update({
                title: title,
                image: image,
                category_id: category_id,
                description: description,
                content: content,
                status_id: status_id
            })
            .eq('id', postId)
            .select();

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({
                message: "Server could not update post because database connection"
            });
        }

        return res.status(200).json({
            message: "Updated post sucessfully"
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: "Server could not update post because database connection"
        });
    }
});

// DELETE /posts/:postId - นักเขียนสามารถลบบทความที่ได้เคยสร้างไว้ก่อนหน้านี้
router.delete("/:postId", async (req, res) => {
    try {
        const { postId } = req.params;

        // Check if post exists first
        const { data: existingPost, error: checkError } = await supabase
            .from('posts')
            .select('id')
            .eq('id', postId)
            .single();

        if (checkError || !existingPost) {
            return res.status(404).json({
                message: "Server could not find a requested post to delete"
            });
        }

        // Delete the post
        const { error } = await supabase
            .from('posts')
            .delete()
            .eq('id', postId);

        if (error) {
            console.error('Database error:', error);
            return res.status(500).json({
                message: "Server could not delete post because database connection"
            });
        }

        return res.status(200).json({
            message: "Deleted post sucessfully"
        });

    } catch (error) {
        console.error('Server error:', error);
        return res.status(500).json({
            message: "Server could not delete post because database connection"
        });
    }
});

export default router;
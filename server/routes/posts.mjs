import express from "express";
import supabase from "../utils/supabase.mjs";
import { validatePostDataSingle } from "../middleware/validation.mjs";
import multer from "multer";
import protectAdmin from "../middleware/protectAdmin.mjs";

const router = express.Router();

// Configure multer for file uploads
const upload = multer({
  storage: multer.memoryStorage(), // Use memory storage for buffer access
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
});

// GET /posts - นักเขียนสามารถดูข้อมูลบทความทั้งหมดในระบบได้
router.get("/", async (req, res) => {
  try {
    const { page = 1, limit = 6, category, keyword } = req.query;
    const offset = (page - 1) * limit;

    // Join with categories table to get category name
    let query = supabase
      .from("posts")
      .select(`
        *,
        categories (
          id,
          name
        )
      `, { count: "exact" });

    // Filter by category name if provided
    if (category) {
      query = query.eq("categories.name", category);
    }

    // Search by keyword if provided
    if (keyword) {
      query = query.or(
        `title.ilike.%${keyword}%,description.ilike.%${keyword}%,content.ilike.%${keyword}%`
      );
    }

    // Add pagination and ordering
    query = query
      .order('date', { ascending: false })
      .range(offset, offset + limit - 1);

    const { data: posts, error, count } = await query;

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        message: "Server could not read post because database connection",
      });
    }

    // Transform the data to match frontend expectations
    const transformedPosts = posts.map(post => ({
      id: post.id,
      image: post.image,
      category: post.categories?.name || 'General',
      title: post.title,
      description: post.description,
      author: 'Admin', // TODO: Add author field to posts table or join with users
      date: post.date,
      content: post.content,
      status_id: post.status_id,
      likes_count: post.likes_count
    }));

    const totalPages = Math.ceil(count / limit);
    const nextPage = page < totalPages ? parseInt(page) + 1 : null;

    return res.status(200).json({
      totalPosts: count,
      totalPages: totalPages,
      currentPage: parseInt(page),
      limit: parseInt(limit),
      posts: transformedPosts,
      nextPage: nextPage,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

// GET /posts/check-title/:title - Check if title already exists
router.get("/check-title/:title", async (req, res) => {
  try {
    const { title } = req.params;
    const { excludeId } = req.query; // Optional: exclude current article when editing

    let query = supabase
      .from("posts")
      .select("id, title")
      .eq("title", decodeURIComponent(title));

    // If editing, exclude the current article from the check
    if (excludeId) {
      query = query.neq("id", excludeId);
    }

    const { data, error } = await query;

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        message: "Server could not check title because database connection",
      });
    }

    return res.status(200).json({
      exists: data && data.length > 0,
      count: data ? data.length : 0,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Server could not check title because database connection",
    });
  }
});

// GET /posts/:postId - นักเขียนสามารถดูข้อมูลบทความอันเดียวได้
router.get("/:postId", async (req, res) => {
  try {
    const { postId } = req.params;

    const { data: post, error } = await supabase
      .from("posts")
      .select(`
        *,
        categories (
          id,
          name
        )
      `)
      .eq("id", postId)
      .single();

    if (error || !post) {
      return res.status(404).json({
        message: "Server could not find a requested post",
      });
    }

    // Transform the data to match frontend expectations
    const transformedPost = {
      id: post.id,
      image: post.image,
      category: post.categories?.name || 'General',
      title: post.title,
      description: post.description,
      author: 'Admin', // TODO: Add author field to posts table or join with users
      date: post.date,
      content: post.content,
      status_id: post.status_id,
      likes_count: post.likes_count,
      likes: post.likes_count // Adding 'likes' alias for frontend compatibility
    };

    return res.status(200).json(transformedPost);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Server could not read post because database connection",
    });
  }
});

// POST /posts - User สามารถสร้างบทความใหม่ขึ้นมาได้ในระบบ (with validation)
router.post("/", [validatePostDataSingle, protectAdmin], async (req, res) => {
  try {
    const {
      title,
      image,
      category_id,
      description,
      content,
      status_id,
      user_id,
    } = req.body;

    // Insert new post into database
    const { data, error } = await supabase
      .from("posts")
      .insert([
        {
          title: title,
          image: image || "", // Default to empty string if no image
          category_id: parseInt(category_id),
          description: description,
          content: content,
          status_id: parseInt(status_id),
          date: new Date().toISOString(), // Add current timestamp
          likes_count: 0, // Default likes count to 0
        },
      ])
      .select();

    if (error) {
      console.error("Database error:", error);
      console.error("Error details:", JSON.stringify(error, null, 2));
      return res.status(500).json({
        message: "Server could not create post because database connection",
        error: error.message,
      });
    }

    return res.status(201).json({
      message: "Created post successfully",
      data: data,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Server could not create post because database connection",
    });
  }
});

// PUT /posts/:postId - นักเขียนสามารถแก้ไขบทความที่ได้เคยสร้างไว้ก่อนหน้านี้ (with validation)
router.put(
  "/:postId",
  [validatePostDataSingle, protectAdmin],
  async (req, res) => {
    try {
      const { postId } = req.params;
      const { title, image, category_id, description, content, status_id } =
        req.body;

      // Check if post exists first
      const { data: existingPost, error: checkError } = await supabase
        .from("posts")
        .select("id")
        .eq("id", postId)
        .single();

      if (checkError || !existingPost) {
        return res.status(404).json({
          message: "Server could not find a requested post to update",
        });
      }

      // Update the post
      const { data, error } = await supabase
        .from("posts")
        .update({
          title: title,
          image: image,
          category_id: category_id,
          description: description,
          content: content,
          status_id: status_id,
        })
        .eq("id", postId)
        .select();

      if (error) {
        console.error("Database error:", error);
        return res.status(500).json({
          message: "Server could not update post because database connection",
        });
      }

      return res.status(200).json({
        message: "Updated post sucessfully",
      });
    } catch (error) {
      console.error("Server error:", error);
      return res.status(500).json({
        message: "Server could not update post because database connection",
      });
    }
  }
);

// DELETE /posts/:postId - นักเขียนสามารถลบบทความที่ได้เคยสร้างไว้ก่อนหน้านี้
router.delete("/:postId", protectAdmin, async (req, res) => {
  try {
    const { postId } = req.params;

    // Check if post exists first
    const { data: existingPost, error: checkError } = await supabase
      .from("posts")
      .select("id")
      .eq("id", postId)
      .single();

    if (checkError || !existingPost) {
      return res.status(404).json({
        message: "Server could not find a requested post to delete",
      });
    }

    // Delete the post
    const { error } = await supabase.from("posts").delete().eq("id", postId);

    if (error) {
      console.error("Database error:", error);
      return res.status(500).json({
        message: "Server could not delete post because database connection",
      });
    }

    return res.status(200).json({
      message: "Deleted post sucessfully",
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({
      message: "Server could not delete post because database connection",
    });
  }
});

// GET /posts/:id - Get single post
router.get("/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("posts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) throw error;

    if (!data) {
      return res.status(404).json({ message: "Post not found" });
    }

    res.json(data);
  } catch (error) {
    console.error("Error fetching post:", error);
    res.status(500).json({ error: error.message });
  }
});

// PUT /posts/:id - Update post
router.put(
  "/:id",
  [upload.single("imageFile"), protectAdmin],
  async (req, res) => {
    try {
      const { id } = req.params;
      const { title, category_id, description, content, status_id, user_id } =
        req.body;

      let imageUrl = null;
      if (req.file) {
        // Upload to Supabase Storage and get URL
        const fileExt = req.file.originalname.split(".").pop();
        const fileName = `${Date.now()}.${fileExt}`;

        const { data: uploadData, error: uploadError } = await supabase.storage
          .from("post-images")
          .upload(fileName, req.file.buffer, {
            contentType: req.file.mimetype,
          });

        if (uploadError) throw uploadError;

        const { data: urlData } = supabase.storage
          .from("post-images")
          .getPublicUrl(fileName);

        imageUrl = urlData.publicUrl;
      }

      const updateData = {
        title,
        category_id: parseInt(category_id),
        description,
        content,
        status_id: parseInt(status_id),
        user_id,
        date: new Date().toISOString(),
      };

      // Only update image if new file is uploaded
      if (imageUrl) {
        updateData.image = imageUrl;
      }

      const { data, error } = await supabase
        .from("posts")
        .update(updateData)
        .eq("id", id)
        .select()
        .single();

      if (error) throw error;
      res.json(data);
    } catch (error) {
      console.error("Error updating post:", error);
      res.status(500).json({ error: error.message });
    }
  }
);

export default router;

import express from "express";
import supabase from "../utils/supabase.mjs";
import { validatePostDataSingle } from "../middleware/validation.mjs";
import protectAdmin from "../middleware/protectAdmin.mjs";
import protectUser from "../middleware/protectUser.mjs";

const router = express.Router();

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

    // Fetch the single admin user to use as author for posts
    const { data: adminUser, error: adminError } = await supabase
      .from("users")
      .select("id, name, profile_pic, bio")
      .eq("role", "admin")
      .single();

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
      category_id: post.category_id, // Keep category_id for admin management
      title: post.title,
      description: post.description,
      author: adminUser?.name || 'Admin',
      authorImage: adminUser?.profile_pic || '',
      authorBio: adminUser?.bio || '',
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

    // Fetch the single admin user to use as author for posts
    const { data: adminUser } = await supabase
      .from("users")
      .select("id, name, profile_pic, bio")
      .eq("role", "admin")
      .single();

    // Transform the data to match frontend expectations
    const transformedPost = {
      id: post.id,
      image: post.image,
      category: post.categories?.name || 'General',
      category_id: post.category_id, // Keep category_id for admin management
      title: post.title,
      description: post.description,
      author: adminUser?.name || 'Admin',
      authorImage: adminUser?.profile_pic || '',
      authorBio: adminUser?.bio || '',
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
          category_id: parseInt(category_id),
          description: description,
          content: content,
          status_id: parseInt(status_id),
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


export default router;

// POST /posts/:postId/like - ผู้ใช้กดถูกใจ/เลิกถูกใจ
router.post("/:postId/like", protectUser, async (req, res) => {
  try {
    const { postId } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ตรวจสอบว่าโพสต์มีอยู่จริง
    const { data: post, error: postError } = await supabase
      .from("posts")
      .select("id, likes_count")
      .eq("id", postId)
      .single();

    if (postError || !post) {
      return res.status(404).json({ message: "Post not found" });
    }

    // ตรวจสอบว่ามี like อยู่แล้วหรือไม่
    const { data: existingLikes, error: likeCheckError } = await supabase
      .from("likes")
      .select("id")
      .eq("post_id", postId)
      .eq("user_id", userId);

    if (likeCheckError) {
      return res.status(500).json({ message: "Could not check like" });
    }

    let newLikesCount = post.likes_count || 0;

    if (existingLikes && existingLikes.length > 0) {
      // ถ้ามี like แล้ว ให้ลบออก (toggle off)
      const likeIdList = existingLikes.map((l) => l.id);
      const { error: deleteError } = await supabase
        .from("likes")
        .delete()
        .in("id", likeIdList);

      if (deleteError) {
        return res.status(500).json({ message: "Could not unlike" });
      }

      newLikesCount = Math.max(0, (post.likes_count || 0) - 1);
    } else {
      // ถ้ายังไม่มี like ให้สร้างใหม่ (toggle on)
      const { error: insertError } = await supabase
        .from("likes")
        .insert([{ post_id: Number(postId), user_id: userId }]);

      if (insertError) {
        return res.status(500).json({ message: "Could not like" });
      }

      newLikesCount = (post.likes_count || 0) + 1;
    }

    // อัปเดต likes_count บนตาราง posts
    const { data: updatedPosts, error: updateError } = await supabase
      .from("posts")
      .update({ likes_count: newLikesCount })
      .eq("id", postId)
      .select("id, likes_count")
      .single();

    if (updateError) {
      return res.status(500).json({ message: "Could not update likes count" });
    }

    return res.status(200).json({
      message: "Like status updated",
      likes_count: updatedPosts.likes_count,
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// GET /posts/:postId/comments - ดึงคอมเมนต์ของโพสต์
router.get("/:postId/comments", async (req, res) => {
  try {
    const { postId } = req.params;

    const { data, error } = await supabase
      .from("comments")
      .select(
        `id, comment_text, created_at, user_id, users ( id, name, profile_pic )`
      )
      .eq("post_id", postId)
      .order("created_at", { ascending: false });

    if (error) {
      return res.status(500).json({ message: "Could not fetch comments" });
    }

    const transformed = (data || []).map((c) => ({
      id: c.id,
      comment_text: c.comment_text,
      created_at: c.created_at,
      user: {
        id: c.users?.id,
        name: c.users?.name,
        profile_pic: c.users?.profile_pic,
      },
    }));

    return res.status(200).json(transformed);
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// POST /posts/:postId/comments - เพิ่มคอมเมนต์ใหม่
router.post("/:postId/comments", protectUser, async (req, res) => {
  try {
    const { postId } = req.params;
    const { comment_text } = req.body;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!comment_text || String(comment_text).trim() === "") {
      return res.status(400).json({ message: "Comment text is required" });
    }

    // แทรกคอมเมนต์ใหม่
    const { data, error } = await supabase
      .from("comments")
      .insert([{ post_id: Number(postId), user_id: userId, comment_text }])
      .select("id, comment_text, created_at, user_id")
      .single();

    if (error) {
      return res.status(500).json({ message: "Could not create comment" });
    }

    // ดึงข้อมูลผู้ใช้ของคอมเมนต์ที่เพิ่งสร้าง
    const { data: userRow } = await supabase
      .from("users")
      .select("id, name, profile_pic")
      .eq("id", userId)
      .single();

    return res.status(201).json({
      id: data.id,
      comment_text: data.comment_text,
      created_at: data.created_at,
      user: userRow ? {
        id: userRow.id,
        name: userRow.name,
        profile_pic: userRow.profile_pic,
      } : { id: userId },
    });
  } catch (error) {
    console.error("Server error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

import express from "express";
import supabase from "../utils/supabase.mjs";
import protectUser from "../middleware/protectUser.mjs";
import connectionPool from "../utils/db.mjs";

const router = express.Router();

// GET /notifications - ดึงการแจ้งเตือนของ user
router.get("/", protectUser, async (req, res) => {
  try {
    const supabaseUserId = req.user?.id;
    
    if (!supabaseUserId) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    // ดึง role ของ user จากตาราง users
    const userQuery = `SELECT role FROM users WHERE id = $1`;
    const { rows: userRows } = await connectionPool.query(userQuery, [supabaseUserId]);
    
    if (!userRows || userRows.length === 0) {
      return res.status(401).json({ message: "User not found" });
    }

    const userRole = userRows[0].role;

    // For admin: show comments and likes on their posts
    if (userRole === "admin") {
      // ดึงโพสต์ที่ admin สร้าง
      const { data: adminPosts, error: postsError } = await supabase
        .from("posts")
        .select("id, title")
        .eq("created_by", supabaseUserId);

      if (postsError) {
        return res.status(500).json({ message: "Could not fetch admin posts" });
      }

      const adminPostIds = (adminPosts || []).map((p) => p.id);

      if (adminPostIds.length === 0) {
        return res.status(200).json([]);
      }

      // ดึง comments ที่เกี่ยวกับโพสต์ของ admin
      const { data: comments, error: commentsError } = await supabase
        .from("comments")
        .select("id, post_id, comment_text, created_at, user_id")
        .in("post_id", adminPostIds)
        .order("created_at", { ascending: false })
        .limit(10);

      if (commentsError) {
        return res.status(500).json({ message: "Could not fetch comments" });
      }

      // ดึงผู้ใช้ที่ comment
      const commentUserIds = (comments || []).map((c) => c.user_id);
      const { rows: commentUsers } = commentUserIds.length > 0 
        ? await connectionPool.query(`SELECT id, name, profile_pic FROM users WHERE id = ANY($1)`, [commentUserIds])
        : { rows: [] };

      const userMap = {};
      commentUsers.forEach((u) => {
        userMap[u.id] = { id: u.id, name: u.name, profile_pic: u.profile_pic };
      });

      // ดึงข้อมูลโพสต์
      const { rows: commentPosts } = adminPostIds.length > 0
        ? await connectionPool.query(`SELECT id, title FROM posts WHERE id = ANY($1)`, [adminPostIds])
        : { rows: [] };

      const postMap = {};
      commentPosts.forEach((p) => {
        postMap[p.id] = { id: p.id, title: p.title };
      });

      // ดึง likes ที่เกี่ยวกับโพสต์ของ admin
      const { data: likes, error: likesError } = await supabase
        .from("likes")
        .select("id, post_id, liked_at, user_id")
        .in("post_id", adminPostIds)
        .order("liked_at", { ascending: false })
        .limit(10);

      if (likesError) {
        return res.status(500).json({ message: "Could not fetch likes" });
      }

      // รวม comments และ likes และเรียงตามเวลา
      const notifications = [];

      (comments || []).forEach((comment) => {
        notifications.push({
          id: `comment-${comment.id}`,
          type: "comment",
          user: userMap[comment.user_id] || { id: comment.user_id, name: "Unknown", profile_pic: null },
          post: postMap[comment.post_id] || { id: comment.post_id, title: "Unknown" },
          message: `Commented on your article:`,
          comment_text: comment.comment_text,
          created_at: comment.created_at,
        });
      });

      const likeUserIds = (likes || []).map((l) => l.user_id);
      const { rows: likeUsers } = likeUserIds.length > 0
        ? await connectionPool.query(`SELECT id, name, profile_pic FROM users WHERE id = ANY($1)`, [likeUserIds])
        : { rows: [] };

      likeUsers.forEach((u) => {
        userMap[u.id] = { id: u.id, name: u.name, profile_pic: u.profile_pic };
      });

      (likes || []).forEach((like) => {
        notifications.push({
          id: `like-${like.id}`,
          type: "like",
          user: userMap[like.user_id] || { id: like.user_id, name: "Unknown", profile_pic: null },
          post: postMap[like.post_id] || { id: like.post_id, title: "Unknown" },
          message: `Liked your article:`,
          created_at: like.liked_at,
        });
      });

      // เรียงตามเวลา (ล่าสุดก่อน)
      notifications.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));

      return res.status(200).json(notifications.slice(0, 10));
    }

    // For regular users: show new posts (status = published)
    else {
      const { data: newPosts, error: postsError } = await supabase
        .from("posts")
        .select("id, title, date, category_id, created_by")
        .eq("status_id", 2) // Published posts only
        .order("date", { ascending: false })
        .limit(10);

      if (postsError) {
        return res.status(500).json({ message: "Could not fetch new posts" });
      }

      // ดึงข้อมูล category และผู้ใช้
      const categoryIds = [...new Set((newPosts || []).map((p) => p.category_id).filter(Boolean))];
      const creatorIds = [...new Set((newPosts || []).map((p) => p.created_by).filter(Boolean))];

      const { rows: categories } = categoryIds.length > 0
        ? await connectionPool.query(`SELECT id, name FROM categories WHERE id = ANY($1)`, [categoryIds])
        : { rows: [] };

      const { rows: creators } = creatorIds.length > 0
        ? await connectionPool.query(`SELECT id, name, profile_pic FROM users WHERE id = ANY($1)`, [creatorIds])
        : { rows: [] };

      const categoryMap = {};
      categories.forEach((c) => {
        categoryMap[c.id] = c.name;
      });

      const creatorMap = {};
      creators.forEach((u) => {
        creatorMap[u.id] = { id: u.id, name: u.name, profile_pic: u.profile_pic };
      });

      const notifications = (newPosts || []).map((post) => ({
        id: `post-${post.id}`,
        type: "new_post",
        user: creatorMap[post.created_by] || { id: post.created_by, name: "Admin", profile_pic: null },
        post: { id: post.id, title: post.title },
        category: categoryMap[post.category_id] || "General",
        message: `Admin posted a new article:`,
        created_at: post.date,
      }));

      return res.status(200).json(notifications);
    }
  } catch (error) {
    console.error("Notifications error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;

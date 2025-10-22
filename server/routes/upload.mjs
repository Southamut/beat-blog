// apps/postRoutes.mjs
import { Router } from "express";
import connectionPool from "../utils/db.mjs";
import protectAdmin from "../middleware/protectAdmin.mjs";
import protectUser from "../middleware/protectUser.mjs";
import multer from "multer";
import supabase from "../utils/supabase.mjs";

const postRouter = Router();

// ตั้งค่า Multer สำหรับการอัปโหลดไฟล์
const multerUpload = multer({ storage: multer.memoryStorage() });

const profilePicUpload = multerUpload.fields([
  { name: "profilePicFile", maxCount: 1 },
]);

const articleImageUpload = multerUpload.fields([
  { name: "articleImage", maxCount: 1 },
]);


// Route สำหรับการอัปเดตโปรไฟล์ผู้ใช้
postRouter.put("/profile", [profilePicUpload, protectUser], async (req, res) => {
  try {
    const { name, username, bio } = req.body;
    const file = req.files?.profilePicFile?.[0];
    const token = req.headers.authorization?.split(" ")[1];
    
    const { data: userData, error: userError } = await supabase.auth.getUser(token);
    if (userError) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // Get current user data from database to preserve existing profile picture
    const { data: currentUserData, error: currentUserError } = await supabase
      .from('users')
      .select('profile_pic, role')
      .eq('id', userData.user.id)
      .single();

    if (currentUserError) {
      return res.status(400).json({ error: "Failed to fetch user data" });
    }

    let profilePicUrl = currentUserData.profile_pic || "";

    // ถ้ามีไฟล์ใหม่ ให้อัปโหลด
    if (file && file.size > 0) {
      const bucketName = "my-personal-blog";
      // Determine if user is admin or regular user
      const userRole = currentUserData.role || 'user';
      const filePath = `profiles/${userRole}/${Date.now()}_${file.originalname}`;

      const { data, error } = await supabase.storage
        .from(bucketName)
        .upload(filePath, file.buffer, {
          contentType: file.mimetype,
          upsert: false,
        });

      if (error) throw error;

      const { data: { publicUrl } } = supabase.storage.from(bucketName).getPublicUrl(data.path);
      profilePicUrl = publicUrl;
    }

    // Update user in database
    const { data: updateData, error: updateError } = await supabase
      .from('users')
      .update({ 
        name, 
        username, 
        profile_pic: profilePicUrl,
        bio: bio || null
      })
      .eq('id', userData.user.id)
      .select();

    if (updateError) {
      return res.status(400).json({ error: updateError.message });
    }

    return res.status(200).json({
      message: "Profile updated successfully",
      user: {
        id: userData.user.id,
        email: userData.user.email,
        name,
        username,
        profile_pic: profilePicUrl,
        bio: bio || null,
      },
    });
  } catch (err) {
    console.error("Profile update error:", err);
    return res.status(500).json({
      message: "Server could not update profile",
      error: err.message,
    });
  }
});

// Route สำหรับการอัปโหลดรูปภาพบทความ
postRouter.post("/article-image", [articleImageUpload], async (req, res) => {
  try {
    const file = req.files?.articleImage?.[0];
    
    if (!file) {
      return res.status(400).json({ error: "No image file provided" });
    }

    // Validate file type
    const allowedTypes = ["image/jpeg", "image/png", "image/gif", "image/webp"];
    if (!allowedTypes.includes(file.mimetype)) {
      return res.status(400).json({ 
        error: "Invalid file type. Please upload a valid image file (JPEG, PNG, GIF, WebP)." 
      });
    }

    // Validate file size (5MB max)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      return res.status(400).json({ 
        error: "File too large. Please upload an image smaller than 5MB." 
      });
    }

    // Upload to Supabase Storage
    const bucketName = "my-personal-blog";
    const filePath = `thumbnail/${Date.now()}_${file.originalname}`;

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false,
      });

    if (error) {
      console.error("Supabase upload error:", error);
      return res.status(500).json({ error: "Failed to upload image" });
    }

    // Get public URL
    const { data: { publicUrl } } = supabase.storage
      .from(bucketName)
      .getPublicUrl(data.path);

    res.status(200).json({
      message: "Image uploaded successfully",
      imageUrl: publicUrl,
    });
  } catch (err) {
    console.error("Article image upload error:", err);
    res.status(500).json({
      message: "Server could not upload image",
      error: err.message,
    });
  }
});

export default postRouter;
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

// กำหนดฟิลด์ที่จะรับไฟล์ (สามารถรับได้หลายฟิลด์)
const imageFileUpload = multerUpload.fields([
  { name: "imageFile", maxCount: 1 },
]);

const profilePicUpload = multerUpload.fields([
  { name: "profilePicFile", maxCount: 1 },
]);

// Route สำหรับการสร้างโพสต์ใหม่
postRouter.post("/", [imageFileUpload, protectAdmin], async (req, res) => {
  try {
    // 1) รับข้อมูลจาก request body และไฟล์ที่อัปโหลด
    const newPost = req.body;
    const file = req.files.imageFile[0];

    // 2) กำหนด bucket และ path ที่จะเก็บไฟล์ใน Supabase
    const bucketName = "my-personal-blog";
    const filePath = `posts/${Date.now()}_${file.originalname}`; // สร้าง path ที่ไม่ซ้ำกัน

    // 3) อัปโหลดไฟล์ไปยัง Supabase Storage
    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file.buffer, {
        contentType: file.mimetype,
        upsert: false, // ป้องกันการเขียนทับไฟล์เดิม
      });

    if (error) {
      throw error;
    }

    // 4) ดึง URL สาธารณะของไฟล์ที่อัปโหลด
    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(data.path);

    // 5) บันทึกข้อมูลโพสต์ลงในฐานข้อมูล
    const query = `INSERT INTO posts (title, image, category_id, description, content, status_id)
      VALUES ($1, $2, $3, $4, $5, $6)`;

    const values = [
      newPost.title,
      publicUrl, // เก็บ URL ของรูปภาพ
      parseInt(newPost.category_id),
      newPost.description,
      newPost.content,
      parseInt(newPost.status_id),
    ];

    await connectionPool.query(query, values);

    // 6) ส่งผลลัพธ์กลับไปยัง client
    return res.status(201).json({ message: "Created post successfully" });
  } catch (err) {
    console.error(err);
    return res.status(500).json({
      message: "Server could not create post",
      error: err.message,
    });
  }
});

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
      .select('profile_pic')
      .eq('id', userData.user.id)
      .single();

    if (currentUserError) {
      return res.status(400).json({ error: "Failed to fetch user data" });
    }

    let profilePicUrl = currentUserData.profile_pic || "";

    // ถ้ามีไฟล์ใหม่ ให้อัปโหลด
    if (file && file.size > 0) {
      const bucketName = "my-personal-blog";
      const filePath = `profiles/${Date.now()}_${file.originalname}`;

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

export default postRouter;
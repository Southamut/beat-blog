import { Router } from "express";
import supabase from "../utils/supabase.mjs";
import connectionPool from "../utils/db.mjs";
import protectUser from "../middleware/protectUser.mjs";
import { validateRegisterBody } from "../middleware/validation.mjs";

const authRouter = Router();

//for register
authRouter.post("/register", validateRegisterBody, async (req, res) => {
  const { email, password, username, name } = req.body;

  try {
    // ตรวจสอบว่า username มีในฐานข้อมูลหรือไม่
    const usernameCheckQuery = `
                                SELECT * FROM users 
                                WHERE username = $1
                               `;
    const usernameCheckValues = [username];
    const { rows: existingUser } = await connectionPool.query(
      usernameCheckQuery,
      usernameCheckValues
    );

    if (existingUser.length > 0) {
      return res.status(400).json({ error: "This username is already taken" });
    }

    // สร้างผู้ใช้ใหม่ผ่าน Supabase Auth
    const emailRedirectTo = `${process.env.CLIENT_URL || 'https://beat-blog-client.vercel.app'}/registration-success`;
    const { data, error: supabaseError } = await supabase.auth.signUp({
      email,
      password,
      options: { emailRedirectTo },
    });

    // ตรวจสอบ error จาก Supabase
    if (supabaseError) {
      if (supabaseError.code === "user_already_exists") {
        return res
          .status(400)
          .json({ error: "User with this email already exists" });
      }
      // จัดการกับ error อื่นๆ จาก Supabase
      return res
        .status(400)
        .json({ error: "Failed to create user. Please try again." });
    }

    const supabaseUserId = data.user.id;

    // เพิ่มข้อมูลผู้ใช้ในฐานข้อมูล PostgreSQL
    const query = `
        INSERT INTO users (id, username, name, role)
        VALUES ($1, $2, $3, $4)
        RETURNING *;
      `;

    const values = [supabaseUserId, username, name, "user"];

    const { rows } = await connectionPool.query(query, values);
    res.status(201).json({
      message: "User created successfully",
      user: rows[0],
    });
  } catch (error) {
    res.status(500).json({ error: "An error occurred during registration" });
  }
});

//for login
authRouter.post("/login", async (req, res) => {
  const { email, password } = req.body;

  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      // ตรวจสอบว่า error เกิดจากข้อมูลเข้าสู่ระบบไม่ถูกต้องหรือไม่
      if (
        error.code === "invalid_credentials" ||
        error.message.includes("Invalid login credentials")
      ) {
        return res.status(400).json({
          error: "Your password is incorrect or this email doesn't exist",
        });
      }
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({
      message: "Signed in successfully",
      access_token: data.session.access_token,
    });
  } catch (error) {
    return res.status(500).json({ error: "An error occurred during login" });
  }
});

//for get user
authRouter.get("/get-user", protectUser, async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  try {
    // ดึงข้อมูลผู้ใช้จาก Supabase
    const { data, error } = await supabase.auth.getUser(token);
    if (error) {
      return res.status(401).json({ error: "Unauthorized or token expired" });
    }

    const supabaseUserId = data.user.id;
    const query = `
                    SELECT * FROM users 
                    WHERE id = $1
                  `;
    const values = [supabaseUserId];
    const { rows } = await connectionPool.query(query, values);

    res.status(200).json({
      id: data.user.id,
      email: data.user.email,
      username: rows[0].username,
      name: rows[0].name,
      role: rows[0].role,
      profile_pic: rows[0].profile_pic,
      bio: rows[0].bio,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

//for reset password
authRouter.put("/reset-password", protectUser, async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1]; // ดึง token จาก Authorization header
  const { oldPassword, newPassword } = req.body;

  if (!token) {
    return res.status(401).json({ error: "Unauthorized: Token missing" });
  }

  if (!newPassword) {
    return res.status(400).json({ error: "New password is required" });
  }

  try {
    // ตั้งค่า session ด้วย token ที่ส่งมา
    const { data: userData, error: userError } = await supabase.auth.getUser(
      token
    );

    if (userError) {
      return res.status(401).json({ error: "Unauthorized: Invalid token" });
    }

    // ตรวจสอบรหัสผ่านเดิมโดยลองล็อกอิน
    const { data: loginData, error: loginError } =
      await supabase.auth.signInWithPassword({
        email: userData.user.email,
        password: oldPassword,
      });

    if (loginError) {
      return res.status(400).json({ error: "Invalid old password" });
    }

    // อัปเดตรหัสผ่านของผู้ใช้
    const { data, error } = await supabase.auth.updateUser({
      password: newPassword,
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(200).json({
      message: "Password updated successfully",
      user: data.user,
    });
  } catch (error) {
    res.status(500).json({ error: "Internal server error" });
  }
});

export default authRouter;

import { Router } from "express";
import supabase from "../utils/supabase.mjs";

const usersRouter = Router();

// GET /users/hero-admin → admin with division = 'main'
usersRouter.get("/hero-admin", async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("users")
      .select("id, name, profile_pic, bio")
      .eq("role", "admin")
      .eq("division", "main")
      .single();

    if (error || !data) return res.status(404).json({ error: "Main admin not found" });
    return res.json(data);
  } catch (e) {
    return res.status(500).json({ error: "Internal server error" });
  }
});

export default usersRouter;



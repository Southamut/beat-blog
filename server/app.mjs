import 'dotenv/config';
import express from "express";
import postsRouter from "./routes/posts.mjs";
import categoriesRouter from "./routes/categories.mjs";
import authRouter from "./routes/auth.mjs"
import cors from 'cors';
import uploadRouter from "./routes/upload.mjs";

const app = express();
const port = process.env.PORT || 4001;

// CORS configuration
const allowedOrigins = (process.env.CORS_ORIGINS || 'http://localhost:5173,http://localhost:3000').split(',').filter(Boolean);
app.use(cors({
    origin(origin, cb) {
        if (!origin || allowedOrigins.includes(origin)) return cb(null, true);
        return cb(new Error('Not allowed by CORS'));
    },
    credentials: true
}));

app.use(express.json({ limit: '50mb' })); // Increase from default ~1mb
app.use(express.urlencoded({ limit: '50mb', extended: true }));

app.get("/test", (req, res) => {
    return res.json("Server API is working 🚀");
});

// Routes
app.use("/posts", postsRouter);
app.use("/categories", categoriesRouter);
app.use("/auth", authRouter);
app.use("/upload", uploadRouter);

// For localhost development
if (process.env.NODE_ENV !== 'production') {
  app.listen(port, () => {
    console.log(`Server is running at http://localhost:${port}`);
  });
}

// Export app for Vercel Functions
export default app;
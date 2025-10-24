import 'dotenv/config';
import express from "express";
import postsRouter from "./routes/posts.mjs";
import categoriesRouter from "./routes/categories.mjs";
import authRouter from "./routes/auth.mjs"
import cors from 'cors';
import uploadRouter from "./routes/upload.mjs";

const app = express();
const port = process.env.PORT || 4001;

app.use(cors({
    origin: (origin, callback) => {
        // Allow same-origin or non-browser requests
        if (!origin) return callback(null, true);

        const allowed = [
            'http://localhost:5173',
            'http://localhost:3000',
            // Production client
            'https://beat-blog-client.vercel.app'
        ];

        // Allow Vercel preview deployments for the client app
        const isVercelPreview = /https:\/\/beat-blog-client-.*\.vercel\.app$/i.test(origin);

        if (allowed.includes(origin) || isVercelPreview) {
            return callback(null, true);
        }
        return callback(new Error('Not allowed by CORS'));
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

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
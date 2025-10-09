import 'dotenv/config';
import express from "express";
import postsRouter from "./routes/posts.mjs";
import categoriesRouter from "./routes/categories.mjs";
import cors from 'cors';

const app = express();
const port = process.env.PORT || 4001;

app.use(cors({
    origin: ['http://localhost:5173', 'http://localhost:3000', 'https://beat-blog-client.vercel.app'],
    credentials: true
}));
app.use(express.json());

app.get("/test", (req, res) => {
    return res.json("Server API is working 🚀");
});

// Routes
app.use("/posts", postsRouter);
app.use("/categories", categoriesRouter);


app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
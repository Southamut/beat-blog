import express from "express";
import postsRouter from "./routes/posts.js";

const app = express();
const port = process.env.PORT || 4001;

app.use(express.json());

app.get("/test", (req, res) => {
    return res.json("Server API is working 🚀");
});

// post
app.use("/posts", postsRouter);

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
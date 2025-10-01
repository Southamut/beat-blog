import express from "express";

const app = express();
const port = process.env.PORT || 4001;

app.use(express.json());

app.get("/test", (req, res) => {
    return res.json("Server API is working 🚀");
});

// GET /profiles - User สามารถดูข้อมูลโปรไฟล์ของ John
app.get("/profiles", (req, res) => {
    try {
        const profileData = {
            data: {
                name: "john",
                age: 20
            }
        };

        return res.status(200).json(profileData);
    } catch (error) {
        return res.status(500).json({
            error: "Internal server error"
        });
    }
});

app.listen(port, () => {
    console.log(`Server is running at ${port}`);
});
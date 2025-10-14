// Validation middleware for blog posts
export const validatePostData = (req, res, next) => {
    const { title, image, category_id, description, content, status_id } = req.body;
    const errors = [];

    // Check if title exists and is string
    if (!title) {
        errors.push("Title is required");
    } else if (typeof title !== 'string') {
        errors.push("Title must be a string");
    }

    // Check if image exists and is string
    if (!image) {
        errors.push("Image is required");
    } else if (typeof image !== 'string') {
        errors.push("Image must be a string");
    }

    // Check if category_id exists and is number
    if (category_id === undefined || category_id === null) {
        errors.push("Category_id is required");
    } else if (typeof category_id !== 'number') {
        errors.push("Category_id must be a number");
    }

    // Check if description exists and is string
    if (!description) {
        errors.push("Description is required");
    } else if (typeof description !== 'string') {
        errors.push("Description must be a string");
    }

    // Check if content exists and is string
    if (!content) {
        errors.push("Content is required");
    } else if (typeof content !== 'string') {
        errors.push("Content must be a string");
    }

    // Check if status_id exists and is number
    if (status_id === undefined || status_id === null) {
        errors.push("Status_id is required");
    } else if (typeof status_id !== 'number') {
        errors.push("Status_id must be a number");
    }

    // If there are validation errors, return 400 with error messages
    if (errors.length > 0) {
        return res.status(400).json({
            message: "Validation failed",
            errors: errors
        });
    }

    // If validation passes, continue to next middleware/route handler
    next();
};

// Alternative validation that returns single error message (more user-friendly)
export const validatePostDataSingle = (req, res, next) => {
    const { title, image, category_id, description, content, status_id } = req.body;

    // Check title
    if (!title) {
        return res.status(400).json({ message: "Title is required" });
    }
    if (typeof title !== 'string') {
        return res.status(400).json({ message: "Title must be a string" });
    }

    // Check image (allow empty string for now)
    if (image !== undefined && typeof image !== 'string') {
        return res.status(400).json({ message: "Image must be a string" });
    }

    // Check category_id
    if (category_id === undefined || category_id === null) {
        return res.status(400).json({ message: "Category_id is required" });
    }
    if (typeof category_id !== 'number') {
        return res.status(400).json({ message: "Category_id must be a number" });
    }

    // Check description
    if (!description) {
        return res.status(400).json({ message: "Description is required" });
    }
    if (typeof description !== 'string') {
        return res.status(400).json({ message: "Description must be a string" });
    }

    // Check content
    if (!content) {
        return res.status(400).json({ message: "Content is required" });
    }
    if (typeof content !== 'string') {
        return res.status(400).json({ message: "Content must be a string" });
    }

    // Check status_id
    if (status_id === undefined || status_id === null) {
        return res.status(400).json({ message: "Status_id is required" });
    }
    if (typeof status_id !== 'number') {
        return res.status(400).json({ message: "Status_id must be a number" });
    }

    // If all validations pass, continue
    next();
};

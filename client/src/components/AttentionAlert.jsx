import { X } from "lucide-react";
import { useState, useEffect } from "react";

export function AttentionAlert({
    type = "success",
    title = "Attention needed",
    message = "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum id ante vitae eros suscipit pulvinar.",
    isVisible = false,
    onClose,
    autoHide = true,
    duration = 5000
}) {
    const [show, setShow] = useState(isVisible);

    useEffect(() => {
        setShow(isVisible);
    }, [isVisible]);

    useEffect(() => {
        if (show && autoHide) {
            const timer = setTimeout(() => {
                handleClose();
            }, duration);
            return () => clearTimeout(timer);
        }
    }, [show, autoHide, duration]);

    const handleClose = () => {
        setShow(false);
        if (onClose) {
            onClose();
        }
    };

    if (!show) return null;

    const bgColor = type === "success" ? "bg-green" : "bg-red";

    return (
        <div className={`fixed bottom-4 right-4 ${bgColor} text-white p-4 rounded-md shadow-lg max-w-md z-50 animate-in slide-in-from-bottom-2 duration-300`}>
            <div className="flex justify-between items-start">
                <div className="flex-1 pr-4">
                    <h2 className="font-bold text-lg mb-1">
                        {title}
                    </h2>
                    <p className="text-sm leading-relaxed">
                        {message}
                    </p>
                </div>
                <button
                    onClick={handleClose}
                    className="text-white hover:text-gray-200 transition-colors flex-shrink-0"
                >
                    <X size={20} />
                </button>
            </div>
        </div>
    );
}

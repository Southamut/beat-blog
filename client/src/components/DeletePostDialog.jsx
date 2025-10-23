import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { Trash2, X } from "lucide-react";

export function DeletePostDialog({
    onDelete,
    triggerStyle = "icon",
    children,
    title = "Delete Post",
    message = "Do you want to delete this post?",
    confirmText = "Delete"
}) {
    // Default trigger button styles
    const getTriggerButton = () => {
        if (children) {
            return children;
        }

        if (triggerStyle === "icon") {
            return (
                <button className="p-2 text-brown-400 hover:text-brown-500 rounded transition-colors">
                    <Trash2 className="h-4 w-4" />
                </button>
            );
        }

        if (triggerStyle === "text") {
            return (
                <button className="flex items-center gap-2 text-brown-400 hover:text-red underline focus:outline-none focus:text-red">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete article
                </button>
            );
        }

        // Default fallback
        return (
            <button className="p-2 hover:bg-brown-200 rounded transition-colors">
                <Trash2 className="h-4 w-4 text-brown-600" />
            </button>
        );
    };

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                {getTriggerButton()}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-white rounded-md pt-16 pb-6 max-w-[22rem] sm:max-w-md flex flex-col items-center">
                <AlertDialogTitle className="text-3xl font-semibold pb-2 text-center">
                    {title}
                </AlertDialogTitle>
                <AlertDialogDescription className="flex flex-row mb-2 justify-center font-medium text-center text-muted-foreground">
                    {message}
                </AlertDialogDescription>
                <div className="flex flex-row gap-4">
                    <AlertDialogCancel className="bg-white rounded-full text-brown-600 border border-brown-400 hover:bg-brown-100 transition-colors w-28 h-12 flex items-center justify-center">
                        Cancel
                    </AlertDialogCancel>
                    <button
                        onClick={onDelete}
                        className="rounded-full text-white bg-brown-600 hover:bg-brown-500 transition-colors w-28 h-12 flex items-center justify-center"
                    >
                        {confirmText}
                    </button>
                </div>
                <AlertDialogCancel className="absolute right-4 top-2 sm:top-4 p-1 border-none">
                    <X className="h-6 w-6" />
                </AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialog>
    );
}

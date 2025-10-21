import { AlertDialog as AlertDialogPrimitive, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { X } from "lucide-react";

export function AlertDialog({
    onConfirm,
    onCancel,
    onClose,
    children,
    title = "Confirm Action",
    message = "Are you sure you want to proceed?",
    confirmText = "Confirm",
    cancelText = "Cancel"
}) {

    return (
        <AlertDialogPrimitive>
            <AlertDialogTrigger asChild>
                {children}
            </AlertDialogTrigger>
            <AlertDialogContent className="bg-brown-100 border-none rounded-2xl pt-16 pb-6 max-w-[22rem] sm:max-w-md flex flex-col items-center">
                <AlertDialogTitle className="text-3xl text-brown-600 font-semibold pb-2 text-center">
                    {title}
                </AlertDialogTitle>
                <AlertDialogDescription className="flex flex-row mb-2 justify-center font-medium text-brown-400 text-center">
                    {message}
                </AlertDialogDescription>
                <div className="flex flex-row gap-4">
                    <AlertDialogCancel 
                        onClick={onCancel}
                        className="bg-white rounded-full text-brown-600 border border-brown-400 hover:bg-brown-100 transition-colors w-28 h-12 flex items-center justify-center"
                    >
                        {cancelText}
                    </AlertDialogCancel>
                    <button
                        onClick={onConfirm}
                        className="rounded-full text-white bg-brown-600 hover:bg-brown-500 transition-colors w-28 h-12 flex items-center justify-center"
                    >
                        {confirmText}
                    </button>
                </div>
                <AlertDialogCancel 
                    onClick={onClose}
                    className="absolute right-4 top-2 sm:top-4 p-1 border-none"
                >
                    <X className="h-6 w-6" />
                </AlertDialogCancel>
            </AlertDialogContent>
        </AlertDialogPrimitive>
    );
}

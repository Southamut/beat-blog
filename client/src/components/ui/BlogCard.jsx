import { Link } from 'react-router-dom';
import { ImageOff } from 'lucide-react';
import { Spinner } from '@/components/ui/spinner';

// BlogCard Component
export function BlogCard(props) {
    const hasImage = props.image && props.image.trim() !== '';
    const hasAuthorImage = props.authorImage && props.authorImage.trim() !== '';
    const authorInitial = props.author ? props.author.charAt(0).toUpperCase() : "?";

    return (
        <div className="flex flex-col gap-4 h-full">
            <Link to={`/post/${props.id}`} className="relative">
                {hasImage ? (
                    <img 
                        className="w-full aspect-[16/10] object-cover rounded-2xl" 
                        src={props.image} 
                        alt={props.title}
                    />
                ) : (
                    <div className="w-full aspect-[16/10] bg-brown-200 rounded-2xl flex items-center justify-center">
                        <ImageOff className="w-16 h-16 text-brown-400" />
                    </div>
                )}
            </Link>
            <div className="flex flex-col h-full">
                <div className="flex">
                    <span className="bg-green-100 rounded-full px-3 py-1 text-sm font-semibold text-green-600 mb-2">{props.category}
                    </span>
                </div>
                <Link to={`/post/${props.id}`}>
                    <h2 className="text-start text-brown-600 font-bold text-xl mb-2 line-clamp-2 hover:underline">
                        {props.title}
                    </h2>
                </Link>
                <p className="text-brown-400 text-sm mb-4 flex-grow line-clamp-3">
                    {props.description}</p>
                <div className="flex items-center text-sm mt-auto">
                    {hasAuthorImage ? (
                        <img className="w-8 h-8 rounded-full mr-2 object-cover" src={props.authorImage} alt="Author" />
                    ) : (
                        <div className="w-8 h-8 rounded-full mr-2 bg-brown-300 text-white flex items-center justify-center font-semibold">
                            {authorInitial}
                        </div>
                    )}
                    <span className="font-medium text-brown-500">{props.author}</span>
                    <span className="mx-2 text-brown-400">|</span>
                    <span className="font-medium text-brown-400">{props.date}</span>
                </div>
            </div>
        </div>
    );
}

// ArticleButton Component
export function ArticleButton(props) {
    return (
        <button
            onClick={props.onClick}
            className={`px-4 py-3 transition-colors rounded-xl text-sm text-muted-foreground font-medium ${props.className}`}
        >
            {props.text}
        </button>
    )
}

// LoadingSpinner Component using shadcn/ui Spinner
export function LoadingSpinner({ message = "Loading...", size = "large" }) {
    const sizeClasses = {
        small: "size-4",
        medium: "size-6", 
        large: "size-8"
    }

    return (
        <div className="flex flex-col justify-center items-center gap-3">
            <Spinner className={`${sizeClasses[size]} text-brown-600`} />
            <div className="text-brown-600">{message}</div>
        </div>
    )
}

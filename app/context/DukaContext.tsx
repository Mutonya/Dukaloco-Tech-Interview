import { createContext, ReactNode, useEffect, useState, useRef } from "react";
import { BlogPosts, CreatePost, Editpost } from "@/app/types/blogposttypes";
import { createPost, deletePost, editPost, fetchBlogPosts } from "@/app/services/apiservice";
import AsyncStorage from "@react-native-async-storage/async-storage";
import NetInfo from "@react-native-community/netinfo";

interface DukaContextType {
    blogPosts: BlogPosts[];
    addpost: (blogpost: CreatePost) => void;
    updatePost: (id: number, blogpost: Editpost) => void;
    deletepost: (id: number) => void;
    currentUser: { id: number };
    loading: boolean;
    error: string | null;
    loadMorePosts: () => void;
    refreshing: boolean;
    refreshPosts: () => void;
    isOnline: boolean;
}

export const DukaContext = createContext<DukaContextType | undefined>(undefined);

export const Dukaprovider = ({ children }: { children: ReactNode }) => {
    const [blogPosts, setPosts] = useState<BlogPosts[]>([]);
    const [currentUser] = useState({ id: 1 }); // Assume the current user ID is 1
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [page, setPage] = useState(1);
    const [refreshing, setRefreshing] = useState(false);
    const [isOnline, setIsOnline] = useState(true);
    const isFetching = useRef(false);

    useEffect(() => {
        const unsubscribe = NetInfo.addEventListener((state) => {
            setIsOnline(state.isConnected ?? false); // Use `false`
        });

        return () => unsubscribe();
    }, []);
    const fetchPosts = async (pageNumber: number = 1) => {
        if (isFetching.current) return; // Prevent concurrent fetches
        isFetching.current = true;

        setLoading(true);
        setError(null);

        try {
            const blogs = await fetchBlogPosts(pageNumber);
            if (pageNumber === 1) {
                setPosts(blogs);
            } else {
                const uniqueNewPosts = blogs.filter(
                    (newPost) => !blogPosts.some((post) => post.id === newPost.id)
                );
                setPosts((prevPosts) => [...prevPosts, ...uniqueNewPosts]);
            }
            setIsOnline(true); // App is online
        } catch (err) {
            // If offline, load cached data
            const cachedPosts = await AsyncStorage.getItem('cached_blog_posts');
            if (cachedPosts) {
                setPosts(JSON.parse(cachedPosts));
            }
            setIsOnline(false); // App is offline
        } finally {
            setLoading(false);
            isFetching.current = false;
        }
    };

    const loadMorePosts = async () => {
        if (!loading) {
            setPage((prevPage) => prevPage + 1);
            await fetchPosts(page + 1);
        }
    };

    const refreshPosts = async () => {
        setRefreshing(true);
        setError(null);
        try {
            const data = await fetchBlogPosts(1);
            setPosts(data);
            setPage(1);
            setIsOnline(true); // App is online
        } catch (err) {
            setError('Failed to refresh posts.');
            setIsOnline(false); // App is offline
        } finally {
            setRefreshing(false);
        }
    };

    useEffect(() => {
        fetchPosts();
    }, []);

    const addpost = async (post: CreatePost) => {
        setLoading(true);
        setError(null);

        // Optimistically update the UI
        const tempId = Date.now(); // Temporary ID for the new post
        const tempPost = { ...post, id: tempId };
        setPosts((prevPosts) => [tempPost, ...prevPosts]);

        try {
            const newPost = await createPost(post);
            // Replace the temporary post with the actual post
            setPosts((prevPosts) =>
                prevPosts.map((p) => (p.id === tempId ? newPost : p))
            );
        } catch (err) {
            // Revert the UI state
            setPosts((prevPosts) => prevPosts.filter((p) => p.id !== tempId));
            setError("Failed to create a new Post");
            alert("Failed to create a new post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const updatePost = async (id: number, updatedPost: Editpost) => {
        setLoading(true);
        setError(null);
        try {
            await editPost(id, updatedPost);
            setPosts((prevPosts) =>
                prevPosts.map((post) => (post.id === id ? updatedPost : post))
            );
        } catch (err) {
            setError("Failed to update post");
            alert("Failed to update the post. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    const deletepost = async (id: number) => {
        if (currentUser.id === 1) {
            setLoading(true);
            setError(null);
            try {
                await deletePost(id);
                setPosts(blogPosts.filter((post) => post.id !== id));
            } catch (err) {
                setError("Failed to delete post");
                alert("Failed to delete the post. Please try again.");
            } finally {
                setLoading(false);
            }
        } else {
            alert('You dont have permissions to delete this post.');
        }
    };

    return (
        <DukaContext.Provider
            value={{
                blogPosts,
                addpost,
                updatePost,
                deletepost,
                currentUser,
                loading,
                error,
                loadMorePosts,
                refreshing,
                refreshPosts,
                isOnline,
            }}
        >
            {children}
        </DukaContext.Provider>
    );
};
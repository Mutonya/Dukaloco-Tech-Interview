import {BlogPosts, CreatePost, Editpost} from "@/app/types/blogposttypes";
import {createContext, ReactNode, useEffect, useState} from "react";
import {createPost, deletePost, editPost, fetchBlogPosts} from "@/app/services/apiservice";


interface DukaContextType{
    blogPosts:BlogPosts[];
    addpost:(blogpost:CreatePost) => void;
    updatePost:(id:number,blogpost:Editpost) =>void
    deletepost:(id:number)=>void;
    currentUser: { id: number };
    loading:boolean;
    error:string |null;
}

export const DukaContext = createContext<DukaContextType |undefined>(undefined)

export const Dukaprovider = ({ children }: { children: ReactNode }) =>{
    const [blogPosts, setPosts] = useState<BlogPosts[]>([]);
    const [currentUser] = useState({id:1}) // we assume the current userId is 1
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const fetchPosts = async ()=>{

        setLoading(true)
        setError(null)

        try {
            const blogs = await fetchBlogPosts()
            setPosts(blogs)
        }catch (err){
            setError('Error Fetching Blogs')
        }finally {
            setLoading(false)
        }

    };

    useEffect(()=>{
     fetchPosts()

    },[]);

    const addpost = async (post: CreatePost) => {
       setLoading(true)
        setError(null)
        try {
            const newPost = await createPost(post);
            setPosts([...blogPosts, newPost]);
        }catch (err){
           setError("Failed to create a new Post")
        }finally {
            setLoading(false)
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
        } finally {
            setLoading(false);
        }
    };


    const deletepost = async (id: number) => {
        if (currentUser.id === 1) {
            setLoading(true)
            setError(null)
           try {
               await deletePost(id);
               setPosts(blogPosts.filter((post) => post.id !== id));
           }catch (err){
                setError("Failed to delete post")
           }finally {
               setLoading(false)
           }
        } else {
            alert('You dont have permissions to delete this post.');
        }
    };
    return (
        <DukaContext.Provider value={{ blogPosts, addpost, updatePost, deletepost, currentUser, loading, error }}>
            {children}

        </DukaContext.Provider>
    );

}
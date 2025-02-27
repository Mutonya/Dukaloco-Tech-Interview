import {BlogPosts, CreatePost, Editpost} from "@/app/types/blogposttypes";
import id from "ajv/lib/vocabularies/core/id";
import {createContext, ReactNode, useEffect, useState} from "react";
import {createPost, deletePost, editPost, fetchBlogPosts} from "@/app/services/apiservice";


interface DukaContextType{
    blogPosts:BlogPosts[];
    addpost:(blogpost:CreatePost) => void;
    editPost:(id:number,blogpost:Editpost) =>void
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
    //use effect is similar to side effect


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

    const editPost = async (id:number,editPost:Editpost)=>{

        setLoading(true)
        setError(null)
        try {
            await editPost(id,editPost);
            setPosts(blogPosts.map((post) => (post.id === id ? editPost : post)));
        }catch (err){
            setError("Failed to update Post")
        }finally {
            setLoading(false)
        }

    }

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
        <DukaContext.Provider value={{ blogPosts, addpost, editPost, deletepost, currentUser,loading,error }}>
            {children}

        </DukaContext.Provider>
    );

}
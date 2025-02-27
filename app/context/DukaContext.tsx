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
}

export const DukaContext = createContext<DukaContextType |undefined>(undefined)

export const Dukaprovider = ({ children }: { children: ReactNode }) =>{
    const [blogPosts, setPosts] = useState<BlogPosts[]>([]);
    const [currentUser] = useState({id:1}) // we assume the current userId is 1

    //use effect is similar to side effect
    useEffect(()=>{
        const fetchPosts = async ()=>{
            const blogs = await fetchBlogPosts()
            setPosts(blogs)
        };
        fetchPosts()
    },[]);

    const addpost = async (post: CreatePost) => {
        const newPost = await createPost(post);
        setPosts([...blogPosts, newPost]);
    };

    const editPost = async (id:number,editPost:Editpost)=>{
        await editPost(id,editPost);
        setPosts(blogPosts.map((post) => (post.id === id ? editPost : post)));
    }

    const deletepost = async (id: number) => {
        if (currentUser.id === 1) {
            await deletePost(id);
            setPosts(blogPosts.filter((post) => post.id !== id));
        } else {
            alert('You dont have permisions to delete this post.');
        }
    };
    return (
        <DukaContext.Provider value={{ blogPosts, addpost, editPost, deletepost, currentUser }}>
            {children}

        </DukaContext.Provider>
    );

}
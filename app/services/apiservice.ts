import {BlogPosts, Editpost} from "@/app/types/blogposttypes";
import axios from "axios";

//define your api calls here
const BASE_URL = 'https://jsonplaceholder.typicode.com';  //define the base url here

export const fetchBlogPosts = async ():Promise<BlogPosts[]> =>{
    const blogposts = await axios.get(`${BASE_URL}/posts`);
    return blogposts.data
}

export const editPost = async (id: number, post: Editpost): Promise<BlogPosts> => {
    const response = await axios.put(`${BASE_URL}/posts/${id}`, post);
    return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
    await axios.delete(`${BASE_URL}/posts/${id}`);
};
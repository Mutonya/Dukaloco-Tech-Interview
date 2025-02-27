import {BlogPosts, CreatePost, Editpost} from "@/app/types/blogposttypes";
import axios from "axios";
import {useToast} from "@/app/components/ToastContext";

//define your api calls here
const BASE_URL = 'https://jsonplaceholder.typicode.com';  //define the base url here


//create an instance of the api
const api = axios.create({
    baseURL:BASE_URL
})

//add request intercepors

api.interceptors.request.use(
    (config) => {
        // our api doesn't require headers at the moment
        console.log('Request Interceptor:', config);
        return config;
    },
    (error) => {
        // intercept api call errors here
        console.error('Request Error Interceptor:', error);
        return Promise.reject(error);
    }
);

// Response interceptor
api.interceptors.response.use(
    (response) => {
        // if there is a succesful api call

        console.log('Response Interceptor:', response);
        return response;
    },
    (error) => {
        // Handle response errors globally
        console.error('Response Error Interceptor:', error);
        return Promise.reject(error);
    }
);

export const fetchBlogPosts = async ():Promise<BlogPosts[]> =>{
    //this api should be paginated and some caching should also take place


    const blogposts = await api.get(`${BASE_URL}/posts`);
    return blogposts.data
}
export const createPost = async (post: CreatePost): Promise<BlogPosts> => {
    const response = await api.post(`${BASE_URL}/posts`, post);
    return response.data;
};

export const editPost = async (id: number, post: Editpost): Promise<BlogPosts> => {
    const response = await api.put(`${BASE_URL}/posts/${id}`, post);
    return response.data;
};

export const deletePost = async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/posts/${id}`);
};
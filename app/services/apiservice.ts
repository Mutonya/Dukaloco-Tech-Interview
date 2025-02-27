import { BlogPosts, CreatePost, Editpost } from "@/app/types/blogposttypes";
import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

const BASE_URL = 'https://jsonplaceholder.typicode.com';
// this should be a Singleton
// Create an instance of the API
//this api calls don't have proper error handling at the moment
const api = axios.create({
    baseURL: BASE_URL,
});

// Add request interceptors incase you need any interceptors in future
api.interceptors.request.use(
    (config) => {
        console.log('Request Interceptor:', config);
        return config;
    },
    (error) => {
        console.error('Request Error Interceptor:', error);
        return Promise.reject(error);
    }
);

// Add response interceptors
api.interceptors.response.use(
    (response) => {
        console.log('Response Interceptor:', response);
        return response;
    },
    (error) => {
        console.error('Response Error Interceptor:', error);
        return Promise.reject(error);
    }
);

// Cache key for storing blog posts
const CACHE_KEY = 'cached_blog_posts';

// Fetch blog posts with pagination and caching
export const fetchBlogPosts = async (page: number = 1, limit: number = 10): Promise<BlogPosts[]> => {
    try {
        const response = await api.get(`${BASE_URL}/posts`, {
            params: {
                _page: page,
                _limit: limit,
            },
        });

        // Cache the fetched posts
        if (page === 1) {
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(response.data));
        } else {
            const cachedPosts = await AsyncStorage.getItem(CACHE_KEY);
            const existingPosts = cachedPosts ? JSON.parse(cachedPosts) : [];
            const newPosts = [...existingPosts, ...response.data];
            await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(newPosts));
        }

        return response.data;
    } catch (error) {
        // If offline, return cached posts
        const cachedPosts = await AsyncStorage.getItem(CACHE_KEY);
        if (cachedPosts) {
            return JSON.parse(cachedPosts);
        }
        throw new Error('Failed to fetch posts. You are offline.');
    }
};

// Create a new post
export const createPost = async (post: CreatePost): Promise<BlogPosts> => {
    const response = await api.post(`${BASE_URL}/posts`, post);
    // Update cached posts
    const cachedPosts = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedPosts) {
        const updatedPosts = [response.data, ...JSON.parse(cachedPosts)];
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedPosts));
    }
    return response.data;
};

// Edit an existing post
export const editPost = async (id: number, post: Editpost): Promise<BlogPosts> => {
    const response = await api.put(`${BASE_URL}/posts/${id}`, post);
    // Update cached posts
    const cachedPosts = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedPosts) {
        const updatedPosts = JSON.parse(cachedPosts).map((p: BlogPosts) =>
            p.id === id ? response.data : p
        );
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedPosts));
    }
    return response.data;
};

// Delete a post
export const deletePost = async (id: number): Promise<void> => {
    await api.delete(`${BASE_URL}/posts/${id}`);
    // Update cached posts
    const cachedPosts = await AsyncStorage.getItem(CACHE_KEY);
    if (cachedPosts) {
        const updatedPosts = JSON.parse(cachedPosts).filter((p: BlogPosts) => p.id !== id);
        await AsyncStorage.setItem(CACHE_KEY, JSON.stringify(updatedPosts));
    }
};
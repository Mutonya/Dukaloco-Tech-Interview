export interface BlogPosts{
    userId:number;
    id:number;
    title:string;
    body:string
}

export interface CreatePost{
    userId:number;
    title:string;
    body:string;

}

export interface Editpost extends CreatePost{
    id:number
}


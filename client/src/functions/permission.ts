import {Post, User, Comment} from "@/types";



const permission = (previlage: string, role: string | null = null): boolean => {
    if(previlage == "all")
        return true;
    else if(previlage == "mod") {
        return role == "author" || role == "admin" || role == "mod";
    }
    else if(previlage == "admin") {
        return role == "author" || role == "admin";
    }
    else return false;
}

export const canDeletePost = (user: User, post: Post): boolean => {
    return !!(user._id === post.user._id || user.admin || post.myRole);
}

export const canDeleteComment = (user: User, post: Post, comment: Comment): boolean => {
    return !!(post.user._id == user._id || user.admin || comment.user._id == user._id || comment.myRole);
}

export default permission;
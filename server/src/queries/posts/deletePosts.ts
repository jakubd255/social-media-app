import CommentModel from "../../models/comments";
import PostModel from "../../models/posts";
import deleteFile from "../files/deleteFile";




const deletePosts = async (query: any) => {
    const posts = await PostModel.find(query).select("_id files").exec();

    posts.map(post => {
        post.files?.map(file => {
            deleteFile(file);
            CommentModel.deleteMany({postId: post._id}).exec();
        });
    });

    await PostModel.deleteMany(query).exec();
}

export default deletePosts;
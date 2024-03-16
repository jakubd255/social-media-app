import React from "react";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Bookmark, MoreHorizontal, Trash2} from "lucide-react";
import {useSelector} from "react-redux";
import {postsActions} from "@/store/slices/postsSlice.ts";
import store from "@/store";
import {Post} from "@/types";
import {canDeletePost} from "@/functions/permission.ts";



const PostDropdownMenu: React.FC<{post: Post}> = ({post}) => {
    const user = useSelector((state: any) => state.auth.user);

    const handleSave = () => store.dispatch(postsActions.save(post._id));
    const handleRemove = () => store.dispatch(postsActions.remove(post._id));

    const saveClass = `icon-left ${post.isSaved && "fill-black dark:fill-white"}`;

    if(user) return(
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button
                    variant="ghost"
                    size="icon"
                    className="w-8 h-8"
                >
                    <MoreHorizontal className="h-4 w-4"/>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
                <DropdownMenuItem onClick={handleSave}>
                    <Bookmark className={saveClass}/>
                    {post.isSaved ? "Remove from saved" : "Save"}
                </DropdownMenuItem>
                {canDeletePost(user, post) ? (
                    <DropdownMenuItem
                        className="!text-destructive"
                        onClick={handleRemove}
                    >
                        <Trash2 className="icon-left"/>
                        Delete
                    </DropdownMenuItem>
                ) : null}
            </DropdownMenuContent>
        </DropdownMenu>
    );
}

export default PostDropdownMenu;
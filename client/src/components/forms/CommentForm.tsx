import {Textarea} from "@/components/ui/textarea.tsx";
import React, {useState} from "react";
import {Button} from "@/components/ui/button.tsx";
import store from "@/store";
import {addComment} from "@/store/slices/commentsSlice.ts";
import {postsActions} from "@/store/slices/postsSlice.ts";



interface CommentFormProps {
    id: string;
    autoFocus?: boolean;
}

const CommentForm: React.FC<CommentFormProps> = ({id, autoFocus}) => {
    const [text, setText] = useState<string>("");
    const handleUpdateText = (e: any) => setText(e.target.value);

    const handleAddComment = () => {
        store.dispatch(addComment({text, id}));
        store.dispatch(postsActions.incrementComments({id: id, inc: 1}));

        setText("");
    }

    return(
        <div className="flex gap-1 p-1">
            <Textarea
                placeholder="Add a comment"
                value={text}
                onChange={handleUpdateText}
                autoFocus={autoFocus}
            />
            <Button onClick={handleAddComment} disabled={!text}>
                Add
            </Button>
        </div>
    );
}

export default CommentForm;
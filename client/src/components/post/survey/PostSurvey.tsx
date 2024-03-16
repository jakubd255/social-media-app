import React, {useState} from "react";
import {RadioGroup} from "@/components/ui/radio-group.tsx";
import {Post, SurveyChoice} from "@/types";
import {Button} from "@/components/ui/button.tsx";
import Vote from "@/components/post/survey/Vote.tsx";
import DestroyableDialog from "@/components/DestroyableDialog.tsx";
import {Users} from "lucide-react";
import {Input} from "@/components/ui/input.tsx";
import {useSelector} from "react-redux";
import store from "@/store";
import {postsActions} from "@/store/slices/postsSlice.ts";
import VotersList from "@/components/post/survey/VotersList.tsx";



const PostSurvey: React.FC<{post: Post}> = ({post}) => {
    const user = useSelector((state: any) => state.auth.user);

    const [newOption, setNewOption] = useState<string>("");

    const handleAddNewOption = () => {
        store.dispatch(postsActions.addVoteOption({id: post._id, option: newOption}));
        setNewOption("");
    }

    const handleVote = (value: string) => {
        if(parseInt(value) !== post.survey?.myVote || !post.survey.myVote) {
            store.dispatch(postsActions.vote({id: post._id, index: parseInt(value)}));
        }
    }

    const haveVoted = !!post.survey?.myVote;

    if(post.survey) return(
        <div className="px-3 flex flex-col gap-2">
            <RadioGroup
                defaultValue={post.survey.myVote?.toString() || undefined}
                onValueChange={handleVote}
            >
                {post.survey.choices.map((choice: SurveyChoice, index: number) => {
                    const percentage = choice.votes * 100/(post.survey?.votesCount || 1);
                    const enabledPreview = ((haveVoted || post.user._id === user._id) && choice.votes);

                    return(
                        <div className="flex gap-1">
                            <Vote
                                id={post._id + "--" + index.toString()}
                                percentage={enabledPreview ? percentage : 0}
                                index={index}
                            >
                                {choice.text}
                            </Vote>
                            <DestroyableDialog
                                trigger={(
                                    <Button
                                        variant="outline"
                                        size="icon"
                                        disabled={!enabledPreview}
                                    >
                                        <Users className="w-4 h-4"/>
                                    </Button>
                                )}
                                content={(
                                    <VotersList id={post._id} index={index}/>
                                )}
                            />
                        </div>
                    );
                })}
            </RadioGroup>
            {post.survey.open ? (
                <div className="flex gap-1">
                    <Input
                        placeholder="Add option"
                        value={newOption}
                        onChange={e => setNewOption(e.target.value)}
                    />
                    <Button
                        variant="outline"
                        disabled={!newOption}
                        onClick={handleAddNewOption}
                    >
                        Add
                    </Button>
                </div>
            ) : null}
            {post.survey.votesCount || 0} votes
        </div>
    );
}

export default PostSurvey;
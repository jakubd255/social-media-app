import React, {useEffect, useState} from "react";
import {useNavigate, useParams} from "react-router-dom";
import {useSelector} from "react-redux";
import server from "@/constants/server.ts";
import {ErrorPage, GroupNotFound} from "@/pages/error";


const JoinToHidden: React.FC = () => {
    const {id} = useParams();
    const navigate = useNavigate();
    const user = useSelector((state: any) => state.auth.user);

    const [status, setStatus] = useState<number>(0);

    useEffect(() => {
        if(user && id) {
            server.put(`/groups/join-to-hidden/${id}`, {}, user.header).then(response => {
                navigate(`/groups/${response.data.id}`);
            }).catch(error => {
                if(error.response.status === 404) {
                    setStatus(404);
                }
            });
        }
    }, [user, id]);

    if(status === 409) {
        return <ErrorPage code={409} message={"You are already a member of this group"}/>
    }
    else if(status === 404) {
        return <GroupNotFound/>
    }
}

export default JoinToHidden;
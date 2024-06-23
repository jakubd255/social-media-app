import {SERVER_URL} from "@/constants/server"



export const videoUrl = (name: string) => {
    return SERVER_URL+"/files/video/"+name;
}

export const fileUrl = (name: string) => {
    return SERVER_URL+"/files/"+name;
}
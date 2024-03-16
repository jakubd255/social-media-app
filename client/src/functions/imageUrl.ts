import { SERVER_URL } from "@/constants/server"

const imageUrl = (name: string) => {
    return SERVER_URL+"/"+name;
}

export default imageUrl;
import {Avatar as AvatarBase, AvatarFallback, AvatarImage} from "./ui/avatar";
import initials from "@/functions/initials";
import {fileUrl} from "@/functions/fileUrl";



interface AvatarType {
    image: string | undefined;
    name: string;
    className?: string
}

const Avatar: React.FC<AvatarType> = ({image, name, className}) => {
    return(
        <AvatarBase className={className}>
            <AvatarFallback>
                {initials(name)}
            </AvatarFallback>
            <AvatarImage src={image && fileUrl(image)}/>
        </AvatarBase>
    );
}

export default Avatar;
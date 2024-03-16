import {Facebook, Github, Instagram, Linkedin, LinkIcon, MapPinned, Youtube} from "lucide-react";
import {Link, useOutletContext} from "react-router-dom";
import {Button} from "@/components/ui/button.tsx";
import React from "react";



const AboutProfile: React.FC = () => {
    const {profile} = useOutletContext<any>();

    const getIcon = (link: string) => {
        if(link.includes("github"))
            return <Github className="mr-2 h-4 w-4"/>;
        else if(link.includes("facebook"))
            return <Facebook className="mr-2 h-4 w-4"/>;
        else if(link.includes("linkedin"))
            return <Linkedin className="mr-2 h-4 w-4"/>;
        else if(link.includes("youtube"))
            return <Youtube className="mr-2 h-4 w-4"/>;
        else if(link.includes("instagram"))
            return <Instagram className="mr-2 h-4 w-4"/>;
        else
            return <LinkIcon className="mr-2 h-4 w-4"/>
    }

    return(
        <div className="flex flex-col gap-8 items-start max-w-[1200px] w-[100%]">
            {profile.bio ? (
                <div className="flex flex-col items-start">
                    <b className="text-left">
                        Bio
                    </b>
                    {profile.bio ? (
                        <pre className="text-left font-sans whitespace-pre-wrap">
                            {profile.bio}
                        </pre>
                    ) : null}
                </div>
            ) : null}
            {profile.location ? (
                <div className="flex gap-1 items-center">
                    <MapPinned className="mr-2 h-4 w-4"/>
                    <span>
                        {profile.location}
                    </span>
                </div>
            ) : null}
            <div className="flex flex-col items-start gap-2">
                {profile.links.length ? (
                    <>
                        <b>
                            Links:
                        </b>
                        <div className="flex flex-col gap-2">
                            {profile.links.map((link: string) =>
                                <Button variant="link" className="w-min p-0 h-min" asChild>
                                    <Link to={link} target="_blank" className="!font-sans !text-base">
                                        {getIcon(link)}
                                        {link}
                                    </Link>
                                </Button>
                            )}
                        </div>
                    </>
                ) : null}
            </div>
        </div>
    );
}

export default AboutProfile;
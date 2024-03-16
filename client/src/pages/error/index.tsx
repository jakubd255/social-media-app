import {Link} from "react-router-dom";
import React from "react";
import {Button} from "@/components/ui/button";
import {Home} from "lucide-react";



export const ErrorPage: React.FC<{code: number, message: string}> = ({code, message}) => {
    return(
        <div className="pt-10 flex flex-col gap-16 items-center w-full">
            <div>
                <h1 className="scroll-m-20 text-9xl font-extrabold text-center">
                    {code}
                </h1>
                <h2 className="scroll-m-20 text-4xl text-center">
                    {message}
                </h2>
            </div>
            <Button asChild>
                <Link to="/">
                    <Home className="mr-2 h-4 w-4"/>
                    Go back home
                </Link>
            </Button>
        </div>
    );
}

export const NotFound = () => <ErrorPage code={404} message="Page not found"/>
export const ProfileNotFound = () => <ErrorPage code={404} message="Profile not found"/>
export const GroupNotFound = () => <ErrorPage code={404} message="Group not found"/>

export const Forbidden = () => <ErrorPage code={403} message="You don't have permission to this section"/>
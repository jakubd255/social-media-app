import {Button} from "@/components/ui/button";
import {Card, CardContent, CardFooter, CardHeader, CardTitle} from "@/components/ui/card";
import {Input} from "@/components/ui/input";
import {LogIn} from "lucide-react";
import {Link, useNavigate} from "react-router-dom";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import {zodResolver} from "@hookform/resolvers/zod";
import server from "@/constants/server";
import Navbar from "@/components/layout/navbar/Navbar";
import React from "react";



const RegisterPage: React.FC = () => {
    document.title = "Register to Social App";

    const navigate = useNavigate();

    const formSchema = z.object({
        email: z.string().email(),
        fullname: z.string().min(2, {message: "Full name must be 2 or more characters long"}),
        username: z.string().min(2, {message: "Username must be 2 or more characters long"}),
        password: z.string().min(8, {message: "Password must be 8 or more characters long"})
    })
    .refine((data) => {
        return /^[a-z0-9._]*$/.test(data.username)
    }, {
        message: "Username can only use lowercase letters, numbers, underscores and periods",
        path: ["username"]
    })
    .refine((data) => {
        return data.username !== "admin"
    }, {
        message: "This username is restricted",
        path: ["username"]
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: "",
            fullname: "",
            username: "",
            password: ""
        }
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        server.post("/auth/register", data).then(() => {
            navigate("/");
        })
        .catch(error => {
            const {usernameTaken, emailTaken} = error.response.data;

            if(usernameTaken) {
                form.setError("username", {message: "This username is taken"});
                form.setValue("password", "");
            }
            if(emailTaken) {
                form.setError("email", {message: "This e-mail is taken"});
                form.setValue("password", "");
            }
        });
    }

    return(
        <>
            <Navbar/>
            <Form {...form}>
                <form 
                    onSubmit={form.handleSubmit(handleSubmit)} 
                    className="flex justify-center mt-[50px]"
                >
                    <Card className="w-[450px]">
                        <CardHeader className="pb-4">
                            <CardTitle>
                                Register
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-10">
                            <div className="flex flex-col gap-3">
                                <FormField control={form.control} name="email" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            E-mail
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="email" {...field} className="!mt-0" autoComplete="new-password"/>
                                        </FormControl>
                                        <FormMessage className="!mt-0"/>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="fullname" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Full name
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} className="!mt-0" autoComplete="new-password"/>
                                        </FormControl>
                                        <FormMessage className="!mt-0"/>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="username" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Username
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} className="!mt-0" autoComplete="new-password"/>
                                        </FormControl>
                                        <FormMessage className="!mt-0"/>
                                    </FormItem>
                                )}/>
                                <FormField control={form.control} name="password" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            Password
                                        </FormLabel>
                                        <FormControl>
                                            <Input type="password" {...field} className="!mt-0" autoComplete="new-password"/>
                                        </FormControl>
                                        <FormMessage className="!mt-0"/>
                                    </FormItem>
                                )}/>
                            </div>
                            <Button className="w-full">
                                <LogIn className="mr-2 h-4 w-4"/>
                                Create account
                            </Button>
                        </CardContent>
                        <CardFooter className="flex gap-2 items-center pt-4">
                            Have an account? 
                            <Button variant="link" className="w-min p-0 h-min" asChild>
                                <Link to="/log-in" className="!font-sans !text-base">
                                    Log in
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </>
    );
}

export default RegisterPage;
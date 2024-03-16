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



const LoginPage: React.FC = () => {
    document.title = "Log in to Social App";

    const navigate = useNavigate();

    const formSchema = z.object({
        emailOrUsername: z.string().min(2, {message: "E-mail or username must be 2 or more characters long"}),
        password: z.string().min(8, {message: "Password must be 8 or more characters long"})
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            emailOrUsername: "",
            password: ""
        }
    });

    const handleSubmit = (data: z.infer<typeof formSchema>) => {
        server.post("/auth/log-in", data).then(() => {
            navigate("/");
        })
        .catch(error => {
            const {invalid, notExist} = error.response.data;
            if(invalid) {
                form.setError("password", {message: "Invalid password"});
                form.setValue("password", "");
            }
            else if(notExist) {
                form.setError("emailOrUsername", {message: "Invalid e-mail or username"});
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
                                Log in
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="flex flex-col gap-10">
                            <div className="flex flex-col gap-3">
                                <FormField control={form.control} name="emailOrUsername" render={({field}) => (
                                    <FormItem>
                                        <FormLabel>
                                            E-mail or username
                                        </FormLabel>
                                        <FormControl>
                                            <Input {...field} className="!mt-0"/>
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
                                            <Input type="password" {...field} className="!mt-0"/>
                                        </FormControl>
                                        <FormMessage className="!mt-0"/>
                                    </FormItem>
                                )}/>
                            </div>
                            <Button className="w-full">
                                <LogIn className="mr-2 h-4 w-4"/>
                                Log in
                            </Button>
                        </CardContent>
                        <CardFooter className="flex gap-2 items-center pt-4">
                            Don't have an account? 
                            <Button variant="link" className="w-min p-0 h-min" asChild>
                                <Link to="/register" className="!font-sans !text-base">
                                    Register
                                </Link>
                            </Button>
                        </CardFooter>
                    </Card>
                </form>
            </Form>
        </>
    );
}

export default LoginPage;
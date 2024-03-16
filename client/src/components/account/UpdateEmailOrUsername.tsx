import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import React from "react";
import * as z from "zod";
import {useSelector} from "react-redux";
import server from "@/constants/server";
import {authActions} from "@/store/slices/authSlice";
import store from "@/store";
import {Input} from "../ui/input";
import {Button} from "../ui/button";



const UpdateEmailOrUsername: React.FC = () => {
    const user = useSelector((state: any) => state.auth.user);
    
    const formSchema = z.object({
        email: z.string().email(),
        username: z.string().min(2, {message: "Username must be 2 or more characters long"}),
    })
    .refine((data) => {
        return /^[a-z0-9._]*$/.test(data.username)
    }, {
        message: "Username can only use lowercase letters, numbers, underscores and periods",
        path: ["username"]
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            email: user.email,
            username: user.username
        }
    });

    const handleUpdate = (data: z.infer<typeof formSchema>) => {
        server.put("users/email-username", data).then(() => {
            store.dispatch(authActions.updateAccount(data));
        })
        .catch(error => {
            const {usernameTaken, emailTaken} = error.response.data;

            if(usernameTaken) {
                form.setError("username", {message: "This username is taken"});
            }
            if(emailTaken) {
                form.setError("email", {message: "This e-mail is taken"});
            }
        });
    }

    const isDisabled = !(form.getValues().email !== user.email || form.getValues().username !== user.username);

    return(
        <Form {...form}>
            <form 
                className="flex flex-col gap-4" 
                onSubmit={form.handleSubmit(handleUpdate)}
            >
                <h2 className="text-2xl text-left">
                    Change e-mail or username
                </h2>
                <FormField control={form.control} name="email" render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            New e-mail
                        </FormLabel>
                        <FormControl>
                            <Input type="email" {...field} className="!mt-0"/>
                        </FormControl>
                        <FormMessage className="!mt-0"/>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="username" render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            New username
                        </FormLabel>
                        <FormControl>
                            <Input {...field} className="!mt-0"/>
                        </FormControl>
                        <FormMessage className="!mt-0"/>
                    </FormItem>
                )}/>
                <Button disabled={isDisabled}>
                    Update
                </Button>
            </form>
        </Form>
    );
}

export default UpdateEmailOrUsername;
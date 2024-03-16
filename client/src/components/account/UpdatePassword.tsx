import React from "react";
import * as z from "zod";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form";
import server from "@/constants/server";
import {Button} from "../ui/button";
import {Input} from "../ui/input";



const UpdatePassword: React.FC = () => {
    const formSchema = z.object({
        currentPassword: z.string().min(8, {message: "Password must be 8 or more characters long"}),
        newPassword: z.string().min(8, {message: "Password must be 8 or more characters long"}),
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            currentPassword: "",
            newPassword: "",
        },
    });

    const handleUpdate = (data: z.infer<typeof formSchema>) => {
        server.put("/users/password", {
            currentPassword: data.currentPassword,
            newPassword: data.newPassword
        })
        .then(() => {})
        .catch(error => {
            if(error.response.data.invalid) {
                form.setError("currentPassword", {message: "Invalid password"});
                form.setValue("currentPassword", "");
                form.setValue("newPassword", "");
            }
        });
    }

    const isDisabled = !Boolean(form.getValues().currentPassword && form.getValues().newPassword);

    return(
        <Form {...form}>
            <form 
                className="flex flex-col gap-4"
                onSubmit={form.handleSubmit(handleUpdate)}
            >
                <h2 className="text-2xl text-left">
                    Change password
                </h2>
                <FormField control={form.control} name="currentPassword" render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            Current password
                        </FormLabel>
                        <FormControl>
                            <Input type="password" {...field} className="!mt-0"/>
                        </FormControl>
                        <FormMessage className="!mt-0"/>
                    </FormItem>
                )}/>
                <FormField control={form.control} name="newPassword" render={({field}) => (
                    <FormItem>
                        <FormLabel>
                            New password
                        </FormLabel>
                        <FormControl>
                            <Input type="password" {...field} className="!mt-0"/>
                        </FormControl>
                        <FormMessage className="!mt-0"/>
                    </FormItem>
                )}/>
                <Button disabled={isDisabled}>
                    Update password
                </Button>
            </form>
        </Form>
    );
}

export default UpdatePassword;
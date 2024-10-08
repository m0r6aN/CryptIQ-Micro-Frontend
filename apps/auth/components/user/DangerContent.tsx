"use client";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { DeleteAccountSchema } from "@/validations";
import { deleteUser } from "@/actions/user.actions";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/auth/FormError";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/lib/utils";
import { IUser } from "@/models/user.model";
import { signOut } from "next-auth/react";

const DangerContent = () => {
  return (
    <Card className="bg-slate-950 border-none">
      <CardHeader>
        <CardTitle className="text-xl font-bold text-rose-500">
          Danger
        </CardTitle>
        <CardDescription className="text-white/80 font-light">
          Once you delete your account, there is no going back. Please be
          certain.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button
              variant="destructive"
              className="mt-5 bg-red-500 text-white"
            >
              Delete Account
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px] bg-slate-950 border-slate-800-foreground/20">
            <DialogHeader></DialogHeader>
            <DeleteForm />
          </DialogContent>
        </Dialog>
      </CardContent>
    </Card>
  );
};

function DeleteForm({ className }: React.ComponentProps<"form">) {
  const [user, setUser] = useState<IUser>({} as IUser);
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>("");

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        setIsPending(false);
      });
  }, []);
  const form = useForm<z.infer<typeof DeleteAccountSchema>>({
    resolver: zodResolver(DeleteAccountSchema),
    defaultValues: {
      password: undefined,
      email: undefined,
    },
  });

  async function onSubmit(values: z.infer<typeof DeleteAccountSchema>) {
    try {
      setIsPending(true);
      setError("");
      if (!values.password && !values.email) {
        setError("Please enter your password or email");
        return;
      }
      const res = await deleteUser(values);
      if (res?.error) {
        setError(res.error);
      }
      if (res?.success) {
        await signOut();
      }
    } catch (error) {
      setError("Something Went Wrong");
    } finally {
      setIsPending(false);
    }
  }
  return (
    <>
      <DialogTitle className="text-red-500">Delete Account</DialogTitle>
      <DialogDescription className="text-white/80 font-light">
        Please enter your{" "}
        <span className="font-bold text-white">{` ${
          user.password ? "password" : "email"
        }`}</span>{" "}
        to confirm account deletion.
      </DialogDescription>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className={cn("grid items-start gap-4", className)}
        >
          <FormField
            control={form.control}
            name={user.password ? "password" : "email"}
            render={({ field }) => (
              <FormItem className="space-y-3.5">
                <FormLabel className="font-bold text-white">{` ${
                  user.password ? "Password" : "Email"
                }`}</FormLabel>
                <FormControl>
                  <Input
                    placeholder={`Enter your ${
                      user.password ? "password" : "email"
                    }`}
                    type={user.password ? "password" : "email"}
                    {...field}
                    className="bg-slate-950 border-slate-700 text-gray-200 border"
                  />
                </FormControl>

                <FormMessage />
              </FormItem>
            )}
          />
          <FormError message={error} />
          <Button
            type="submit"
            disabled={isPending}
            className=" mb-2 rounded-lg bg-red-500  text-white "
          >
            Delete Account
          </Button>
        </form>
      </Form>
    </>
  );
}

export default DangerContent;

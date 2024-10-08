"use client";
//[imports]
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SetPasswordSchema } from "@/validations";
import { useMessageHandler } from "../auth/useMessageHandler";
import { changePassword, setNewPassword } from "@/actions/user.actions";
import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";
import {
  Form,
  FormControl,
FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { FormError } from "@/components/auth/FormError";
import { FormSuccess } from "@/components/auth/FormSuccess";
import { zodResolver } from "@hookform/resolvers/zod";
import { usePathname } from "next/navigation";
import Loader from "@/components/auth/Loader";
const SecuityContent = () => {
  const [user, setUser] = useState<any>({});
  const [isPending, setIsPending] = useState(false);
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const [type, setType] = useState("");
    useMessageHandler(
    error,
    success,
    setError,
    setSuccess,
    Date.now().toLocaleString(),
  );

  useEffect(() => {
    fetch("/api/user")
      .then((res) => res.json())
      .then((data) => {
        setUser(data);
        if (data.password) {
          setType("Change Password");
        } else {
          setType("New Password");
        }
        setIsPending(false);
      });
  }, []);

  const form = useForm<z.infer<typeof SetPasswordSchema>>({
    resolver: zodResolver(SetPasswordSchema),
    defaultValues: {
      oldPassword: undefined,
      newPassword: "",
      confirmNewPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof SetPasswordSchema>) {
    try {
      setIsPending(true);
      setSuccess("");
      setError("");

      if (type === "New Password") {
        if (values.newPassword === values.confirmNewPassword) {
          await setNewPassword(values)
            .then((res: any) => {
              if (res?.error) {
                setError(res.error);
              }
              if (res?.success) {
                setSuccess(res.success);
              }
            })
            .catch(() => {
              setError("Something Went Wrong");
            });
        } else {
          setError("Passowrd Do Not Match");
        }
      } else if (type === "Change Password") {
        if (values.newPassword === values.confirmNewPassword) {
          await changePassword(values)
            .then((res: any) => {
              if (res?.error) {
                setError(res.error);
              }
              if (res?.success) {
                setSuccess(res.success);
              }
            })
            .catch(() => {
              setError("Something Went Wrong");
            });
        } else {
          setError("Passowrd Do Not Match");
        }
      }
    } catch (error: any) {
      console.log(error);
      setError("Something Went Wrong");
    } finally {
      setIsPending(false);
    }
  }
  return (
    <Card className="bg-slate-950 border-none">
      <CardHeader>
        <CardTitle className="text-gray-200 font-bold">Security</CardTitle>
        <CardDescription className="text-white/80 font-light">
          Manage you account security. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-2">
        {type ? (
          <>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="mt-5 flex w-full flex-col gap-9 "
              >
                {type === "Change Password" && (
                  <FormField
                    control={form.control}
                    name="oldPassword"
                    render={({ field }) => (
                      <FormItem className="space-y-2">
                        <FormLabel className="font-semibold text-gray-200">
                          Old Password
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="Old Password"
                            type="password"
                            {...field}
                            className="bg-slate-950 border-slate-700 text-gray-200 border"
                          />
                        </FormControl>

                        <FormMessage />
                      </FormItem>
                    )}
                  />
                )}
                <FormField
                  control={form.control}
                  name="newPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="font-semibold text-gray-200">
                        New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Type In Your New Password"
                          type="password"
                          {...field}
                          className="bg-slate-950 border-slate-700 text-gray-200 border"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="confirmNewPassword"
                  render={({ field }) => (
                    <FormItem className="space-y-2">
                      <FormLabel className="font-semibold text-gray-200">
                        Confirm New Password
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Please Confrim Your Password"
                          type="password"
                          {...field}
                          className="bg-slate-950 border-slate-700 text-gray-200 border"
                        />
                      </FormControl>

                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormError message={error} />
                <FormSuccess message={success} />
                {!isPending ? (
                  <Button
                    type="submit"
                    className="w-full bg-white text-slate-900 hover:bg-white/85"
                    disabled={isPending}
                  >
                    Save
                  </Button>
                ) : (
                  <div className="m-10">
                    <Loader color={"white"} />
                  </div>
                )}
              </form>
            </Form>
            {/*TwoFactorToggle*/}
          </>
        ) : (
          <Loader color="white" />
        )}
      </CardContent>
    </Card>
  );
};

export default SecuityContent;

//[TwoFactorToggleClient]

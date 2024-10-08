"use client";

import React, { useState } from 'react';
import { ArrowRight } from 'lucide-react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogTrigger } from '@/components/ui/dialog';
import { useForm } from 'react-hook-form';
import { UpdateUserSchema } from '@/validations';
import * as z from 'zod';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { FormError } from '@/components/auth/FormError';
import { FormSuccess } from '@/components/auth/FormSuccess';
import { zodResolver } from '@hookform/resolvers/zod';
import ChooseAvatar from '@/components/user/ChooseAvatar';
import { useMessageHandler } from "../auth/useMessageHandler";
import { updateUserNameUser } from '@/actions/user.actions';
import { usePathname } from 'next/navigation';
import { useSession } from "next-auth/react";
import { useCurrentUser } from '@/lib/utils/useCurrentUser';
import Loader from '@/components/auth/Loader';

const AccountContent = () => {
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>("");
  const [isPending, setIsPending] = useState<boolean | undefined>(false);
  const pathname = usePathname();
  const { update } = useSession();
    useMessageHandler(
    error,
    success,
    setError,
    setSuccess,
    Date.now().toLocaleString(),
  );
  const user = useCurrentUser();

  const form = useForm<z.infer<typeof UpdateUserSchema>>({
    resolver: zodResolver(UpdateUserSchema),
    defaultValues: {
      name: user?.name || "",
    },
  });

  async function onSubmit(values: z.infer<typeof UpdateUserSchema>) {
    try {
      setIsPending(true);
      setSuccess("");
      setError("");
      if (
        values.name === user?.name
      )
        return;

      await updateUserNameUser(values, pathname)
        .then((res) => {
          if (res?.error) {
            setError(res.error);
          }
          if (res?.success) {
            setSuccess(res.success);
          }
        })
        .catch((error) => {
          setError(error);
        });
       await update(); 
    } catch (error) {
      setError('Something went wrong');
    } finally {
      setIsPending(false);
    }
  }

  return (
    <Card className="bg-slate-950 border-none">
      <CardHeader>
        <CardTitle className="text-white font-bold">Account</CardTitle>
        <CardDescription className="text-white/80 font-light">
          Make changes to your account here. Click save when you&apos;re done.
        </CardDescription>
      </CardHeader>
        <CardContent className="space-y-2">
          <Dialog>
            <DialogTrigger>
              <div className="flex w-full gap-28">
                <div className="rounded-full ">
                  <Image
                    src={user?.image!}
                    alt="profile "
                    width={60}
                    height={68}
                    className="w-20 h-20 rounded-full"
                  />
                </div>
                <span className=" flex gap-2 items-center justify-center text-white/75 hover:text-white ">
                  Change Avatar <ArrowRight />
                </span>
              </div>
            </DialogTrigger>
            <DialogContent className="p-0 w-full border-none">
              <ChooseAvatar />
            </DialogContent>
          </Dialog>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
              <div className="space-y-6 ">
                <>
                  <FormField
                    control={form.control}
                    name="name"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="text-gray-200">Name</FormLabel>
                        <FormControl>
                          <Input
                            placeholder="name"
                            type="text"
                            disabled={isPending}
                            {...field}
                            className="bg-slate-950 border-slate-700 text-gray-200 border" 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </>
              </div>
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
        </CardContent>
    </Card>
  );
};

export default AccountContent;
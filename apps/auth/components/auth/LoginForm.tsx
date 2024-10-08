"use client";
//[imports]
import { CardWrapper } from "@/components/auth/CardWrapper";

export const LoginForm = () => {
  return (
    <CardWrapper
      BackButtonHref="/terms"
      BackButtonLabel="Terms & Conditions"
      showSocial
    >
      <p className="font-bold text-gray-300 text-lg ">Sign in</p>
      <p className="text-gray-300">to continue to platform</p>
    </CardWrapper>
  );
};

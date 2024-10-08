"use client";
import { updateUserImage } from "@/actions/user.actions";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState } from "react";
import { ProfileUrls } from "@/lib/constant";
import { Loader } from "lucide-react";
import { useSession } from "next-auth/react";

import { FormSuccess } from "../auth/FormSuccess";
import { useMessageHandler } from "../auth/useMessageHandler";
import { FormError } from "../auth/FormError";

const ChooseAvatar = () => {
  const [loading, setLoading] = useState(false);
  const { update } = useSession();
  const [error, setError] = useState<string>("");
  const [success, setSuccess] = useState<string>("");
  const path = usePathname();

  useMessageHandler(
    error,
    success,
    setError,
    setSuccess,
    Date.now().toLocaleString(),
  );
  const handleImageChange = async (img: string) => {
    try {
      setLoading(true);
      const res = await updateUserImage({ image: img, path });
      update();
      if (res?.error) {
        setError(res.error);
      }
      if (res?.success) {
        setSuccess(res.success);
      }
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="h-[400px] rounded-md p-5 overflow-y-scroll bg-slate-950 custom-scrollbar  ">
      <h2 className="font-bold text-2xl text-white/95  m-2 border-b-2 border-white">
        Choose An Image
      </h2>
      <div className="absolute z-50 -top-16 left-0 w-full">
        <FormSuccess message={success} />
        <FormError message={error} />
      </div>
      <div className="flex flex-wrap items-center justify-between gap-10 transition-all ">
        {ProfileUrls.map((img) => (
          <div
            key={img}
            className="group relative h-20 w-20 overflow-hidden rounded-full"
          >
            <Image
              src={img}
              className="h-20 w-20 rounded-full object-fill transition-transform duration-300 ease-in-out group-hover:scale-110"
              alt="profile"
              width={120}
              height={120}
            />
            <div className="absolute bottom-2 opacity-100 transition-opacity duration-300">
              <button
                className="hover:bg-slate-800  w-20
              translate-y-12 rounded-full bg-slate-900 px-5 py-2.5 text-center
              text-sm 
              font-medium text-white  transition-all group-hover:translate-y-2"
                onClick={() => {
                  handleImageChange(img);
                }}
                disabled={loading}
              >
                {loading && (
                  <Loader className="animate-spin h-5 w-5 text-center ml-[10px]" />
                )}
                {!loading && <p className="text-xs">Choose</p>}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ChooseAvatar;

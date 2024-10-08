import { Poppins } from "next/font/google";

const font = Poppins({
  subsets: ["latin"],
  weight: ["600"],
});

interface HeaderProps {
  label?: string;
}
export const Header = ({ label }: HeaderProps) => {
  return (
    <div className="w-full flex text-center flex-col gap-y-4 ">
      <p className="font-bold text-4xl  ">Auth Rush</p>
      <p className="text-white/80-foreground text-sm">{label}</p>
    </div>
  );
};
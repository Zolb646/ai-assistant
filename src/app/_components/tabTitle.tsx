import { BsStars } from "react-icons/bs";
import { LuFileText } from "react-icons/lu";

export const TabTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-2">
      <BsStars className="text-xl" />
      <p className="font-semibold text-lg">{title}</p>
    </div>
  );
};

export const TabResultTitle = ({ title }: { title: string }) => {
  return (
    <div className="flex items-center gap-2">
      <LuFileText className="text-xl" />
      <p className="font-semibold text-lg">{title}</p>
    </div>
  );
};

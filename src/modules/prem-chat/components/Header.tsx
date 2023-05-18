import clsx from "clsx";
import setting from "assets/images/setting.svg";
import HistoryNavigator from "./HistoryNavigator";
import { HeaderProps } from "../types";

const Header = ({ setRightSidebar, rightSidebar }: HeaderProps) => {
  return (
    <div className="border-b border-light w-full h-[77px] py-3 flex sticky bg-darkjunglegreen z-[11] top-0">
      <HistoryNavigator />
      <div className="border-l border-light pl-6 flex items-center ml-auto max-w-max w-full absolute right-0">
        <button
          type="button"
          className="bg-sonicsilver py-3 px-4 rounded-md text-lg font-proximaNova-regular text-white"
        >
          Share Chat
        </button>
        <button
          onClick={() => setRightSidebar(true)}
          className={clsx(rightSidebar && "hidden", "py-3 px-[22px]")}
          type="button"
        >
          <img src={setting} alt="msg" width={22} height={22} />
        </button>
      </div>
    </div>
  );
};

export default Header;

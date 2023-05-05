import React from "react";
import setting from "../../assets/images/setting.svg";
import HistoryNavigator from "./HistoryNavigator";

const Header = () => {
  return (
    <div className="border-b border-light w-full h-[77px] py-3 flex">
      <HistoryNavigator />
      <div className="border-l border-light pl-6 flex items-center ml-auto max-w-max w-full">
        <button
          type="button"
          className="bg-sonicsilver py-3 px-4 rounded-md text-lg font-proximaNova-regular text-white"
        >
          Share Chat
        </button>
        <img
          className="mx-[22px]"
          src={setting}
          alt="msg"
          width={22}
          height={22}
        />
      </div>
    </div>
  );
};

export default Header;

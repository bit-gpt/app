import clsx from "clsx";
import setting from "assets/images/setting.svg";
import { HeaderProps } from "../types";
import WarningModal from "modules/service/components/WarningModal";
import { useState } from "react";
import WarningIcon from "shared/components/WarningIcon";

const Header = ({ setRightSidebar, rightSidebar, title }: HeaderProps) => {
  const [open, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  const openModal = () => {
    setIsOpen(true);
  };

  return (
    <>
      <div className="border-b border-light w-full h-[77px] py-3 flex sticky bg-darkjunglegreen z-[11] top-0">
        <div className="max-md:w-full flex md:justify-center header__center">
          <h1 className="flex items-center text-white md:text-xl text-md font-proximaNova-regular mx-[20px]">
            {title}
          </h1>
        </div>
        <div className="border-l border-light md:pl-6 pl-4 flex items-center ml-auto max-w-max w-full absolute right-0">
          <button
            type="button"
            onClick={openModal}
            className={clsx(
              "bg-sonicsilver py-3 px-4 rounded-md md:text-lg text-sm font-proximaNova-regular text-white",
              rightSidebar && "mr-6"
            )}
          >
            Share Chat
          </button>
          <button
            onClick={() => setRightSidebar(true)}
            className={clsx(rightSidebar && "hidden", "py-3 md:px-[22px] px-4")}
            type="button"
          >
            <img src={setting} alt="msg" width={22} height={22} />
          </button>
        </div>
      </div>
      <WarningModal
        description="Coming Soon"
        title="Share Chat"
        isOpen={open}
        onCancel={closeModal}
        onOk={closeModal}
        icon={<WarningIcon />}
      />
    </>
  );
};

export default Header;

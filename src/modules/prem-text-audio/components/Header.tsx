import hamburgerMenu from "assets/images/hamburger-menu.svg";
import setting from "assets/images/setting.svg";
import clsx from "clsx";
import WarningModal from "modules/service/components/WarningModal";
import { useState } from "react";
import WarningIcon from "shared/components/WarningIcon";
import type { HeaderProps } from "shared/types";

const Header = ({
  setRightSidebar,
  rightSidebar,
  hamburgerMenuOpen,
  setHamburgerMenu,
  title,
}: HeaderProps) => {
  const [open, setIsOpen] = useState(false);

  const closeModal = () => {
    setIsOpen(false);
  };

  return (
    <>
      <div className="md:border-b border-light w-full h-[77px] py-3 flex sticky bg-grey-900 z-[11] top-0 justify-center">
        <div className="max-md:w-full flex md:justify-center header__center max-md:items-center">
          <button
            onClick={() => setHamburgerMenu(!hamburgerMenuOpen)}
            className="md:hidden ml-5 w-10 h-10"
          >
            <img src={hamburgerMenu} alt="msg" width={22} height={22} className="mx-auto" />
          </button>
          <h1 className="flex items-center text-white md:text-xl text-md ">{title}</h1>
        </div>
        <div className="flex items-center ml-auto max-w-max w-full md:absolute md:right-0">
          <button
            onClick={() => setRightSidebar(true)}
            className={clsx(rightSidebar && "hidden", "setting__btn")}
            type="button"
          >
            <img src={setting} alt="msg" width={22} height={22} />
          </button>
        </div>
      </div>
      <WarningModal
        description="Share Chat is not available yet"
        title="Coming Soon"
        isOpen={open}
        onCancel={closeModal}
        onOk={closeModal}
        icon={<WarningIcon />}
      />
    </>
  );
};

export default Header;

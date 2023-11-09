import clsx from "clsx";
import { useNavigate } from "react-router-dom";

import leftArrow from "../../assets/images/arrow.svg";
import cross from "../../assets/images/cross.svg";
import Logo from "../../assets/images/logo.svg";
import type { Service } from "../../modules/service/types";

interface LeftSidebarProps {
  hamburgerMenuOpen: boolean;
  setHamburgerMenu: (value: boolean) => void;
  serviceId: string;
  serviceType: Service["serviceType"];
  children?: React.ReactNode;
}

const LeftSidebar = ({
  hamburgerMenuOpen,
  setHamburgerMenu,
  serviceId,
  serviceType,
  children,
}: LeftSidebarProps) => {
  const navigate = useNavigate();

  const onCloseClick = () => {
    navigate(`/services/${serviceId}/${serviceType}/detail`);
  };

  return (
    <div className={clsx("sidebar left-sidebar", { "max-md:hidden": hamburgerMenuOpen })}>
      <div className="flex max-md:flex-wrap md:gap-4">
        <button className="mx-2" onClick={onCloseClick}>
          <img src={leftArrow} alt="left-arrow" className="max-md:max-w-[15px]" />
        </button>
        <img className="left-sidebar__logo" src={Logo} alt="logo" />
        <button
          onClick={() => setHamburgerMenu(true)}
          className="w-[30px] md:hidden z-[11] fixed right-[14px] top-[24px]"
        >
          <img src={cross} alt="cross" width={22} height={22} className="mx-auto" />
        </button>
      </div>
      {children}
    </div>
  );
};

export default LeftSidebar;

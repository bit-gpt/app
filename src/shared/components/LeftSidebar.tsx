import { useNavigate } from "react-router-dom";

import leftArrow from "../../assets/images/arrow.svg";
import cross from "../../assets/images/cross.svg";
import Logo from "../../assets/images/logo.svg";

interface LeftSidebarProps {
  setHamburgerMenu: (value: boolean) => void;
  children?: React.ReactNode;
}

const LeftSidebar = ({ setHamburgerMenu, children }: LeftSidebarProps) => {
  const navigate = useNavigate();

  const onCloseClick = () => {
    navigate("/");
  };

  return (
    <div className="md:pt-7 !bg-grey-800 pt-[22px] pb-[10px] flex-col px-2 flex md:h-screen sidebar md:!w-[259px]">
      <div className="flex max-md:flex-wrap md:gap-4">
        <button className="mx-2" onClick={onCloseClick}>
          <img src={leftArrow} alt="left-arrow" className="max-md:max-w-[15px]" />
        </button>
        <img className="sidebar__logo" src={Logo} alt="logo" />
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

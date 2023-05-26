import { SidebarProps } from "shared/types";
import brandLogo from "assets/images/brand-logo.svg";
import DashboardIcon from "./DashboardIcon";
import ServiceIcon from "./ServiceIcon";
import SettingIcon from "./SettingIcon";
import DocumentationIcon from "./DocumentationIcon";
import LeftArrowIcon from "./LeftArrowIcon";
import NavLinkItem from "./NavLinkItem";
import NavLinkContainer from "./NavLinkContainer";

const Sidebar = ({ toggle }: SidebarProps) => {
  return (
    <div className={"sidebar-main sidebar-toggle"}>
      <div className="pt-[18px] pb-[70px] flex-col px-2 flex h-screen sidebar">
        <div className="flex">
          <img className="ml-[10px]" src={brandLogo} alt="brandLogo" />
        </div>
        <NavLinkContainer className="my-6 overflow-y-auto flex-grow scrollbar-none">
          <NavLinkItem
            to="/"
            icon={<DashboardIcon className={""} />}
            label="Dashboard"
          />
          <NavLinkItem
            to="/services"
            icon={<ServiceIcon className={""} />}
            label="Services"
          />
        </NavLinkContainer>

        <NavLinkContainer className="sidebar-last__row">
          <div className="border-t border-timberwolf opacity-30 -mx-2 pt-[13px]"></div>
          <NavLinkItem
            to="/documentation"
            label="Documentation"
            icon={<DocumentationIcon className={""} />}
          />
          <NavLinkItem
            to="/settings"
            label="Settings"
            icon={<SettingIcon className={"svg-stroke"} />}
          />
        </NavLinkContainer>
      </div>
      <div className="sidebar-toggle__btn">
        <button
          onClick={toggle}
          className="bg-Onyx px-[8.4px] mr-3 -ml-[6px] py-[10px] rounded-md"
        >
          <LeftArrowIcon />
        </button>
        <span>Close Sidebar</span>
      </div>
    </div>
  );
};

export default Sidebar;

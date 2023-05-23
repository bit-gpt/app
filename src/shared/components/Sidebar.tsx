import { Link, NavLink } from "react-router-dom";
import clsx from "clsx";
import { SidebarProps } from "shared/types";
import Logo from "assets/images/logo.svg";
import brandLogo from "assets/images/brand-logo.svg";
import DashboardIcon from "./DashboardIcon";
import ServiceIcon from "./ServiceIcon";
import PipelineIcon from "./PipelineIcon";
import SettingIcon from "./SettingIcon";
import DocumentationIcon from "./DocumentationIcon";
import LeftArrowIcon from "./LeftArrowIcon";
import NavLinkItem from "./NavLinkItem";
import NavLinkContainer from "./NavLinkContainer";

const Sidebar = ({ toggle, toggleStatus }: SidebarProps) => {
  return (
    <div className={clsx({ "sidebar-toggle": toggleStatus }, "sidebar-main")}>
      <div className="pt-[18px] pb-[70px] flex-col px-2 flex h-screen sidebar">
        <div className={clsx("flex", { "flex-col": toggleStatus })}>
          <img className="sidebar__logo" src={Logo} alt="logo" />
          <img
            className={clsx(
              { "mx-auto": toggleStatus },
              { hidden: !toggleStatus }
            )}
            src={brandLogo}
            alt="brandLogo"
          />
        </div>
        <NavLinkContainer className="my-6 overflow-y-auto flex-grow scrollbar-none">
          <NavLinkItem
            to="/"
            icon={<DashboardIcon className={clsx({ "mr-4": !toggleStatus })} />}
            label="Dashboard"
          />
          <NavLinkItem
            to="/services"
            icon={<ServiceIcon className={clsx({ "mr-4": !toggleStatus })} />}
            label="Services"
          />
          <NavLinkItem
            to="/pipeline"
            icon={<PipelineIcon className={clsx({ "mr-4": !toggleStatus })} />}
            label="Pipeline"
          />
        </NavLinkContainer>

        <NavLinkContainer>
          <div className="border-t border-timberwolf opacity-30 -mx-2 pt-[13px]"></div>
          <NavLinkItem
            to="/documentation"
            label="Documentation"
            icon={
              <DocumentationIcon className={clsx({ "mr-4": !toggleStatus })} />
            }
          />
          <NavLinkItem
            to="/settings"
            label="Settings"
            icon={
              <SettingIcon
                className={clsx({ "mr-4": !toggleStatus }, "svg-stroke")}
              />
            }
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

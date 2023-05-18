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

const Sidebar = ({ setSidebarToggle, sidebarToggle }: SidebarProps) => {
  return (
    <div className={clsx(sidebarToggle && "sidebar-toggle", "sidebar-main")}>
      <div className="pt-[18px] pb-[70px] flex-col px-2 flex h-screen sidebar">
        <div className={clsx(sidebarToggle ? "flex-col flex" : "flex")}>
          <img className="sidebar__logo" src={Logo} alt="logo" />
          <img
            className={clsx(sidebarToggle ? "mx-auto" : "hidden")}
            src={brandLogo}
            alt="brandLogo"
          />
        </div>
        <ul className="my-6 overflow-y-auto flex-grow scrollbar-none">
          <li>
            <NavLink
              to={`/`}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <DashboardIcon className={clsx(!sidebarToggle && "mr-4")} />
              <span>Dashboard</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/service`}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <ServiceIcon className={clsx(!sidebarToggle && "mr-4")} />
              <span>Services</span>
            </NavLink>
          </li>
          <li>
            <NavLink
              to={`/pipeline`}
              className={({ isActive }) => (isActive ? "active" : "")}
            >
              <PipelineIcon className={clsx(!sidebarToggle && "mr-4")} />
              <span>Pipeline</span>
            </NavLink>
          </li>
        </ul>
        <ul>
          <div className="border-t border-timberwolf opacity-30 -mx-2 pt-[13px]"></div>
          <li>
            <Link to={`/`}>
              <DocumentationIcon className={clsx(!sidebarToggle && "mr-4")} />
              <span>Documentation</span>
            </Link>
          </li>
          <li>
            <Link to={`/`}>
              <SettingIcon
                className={clsx(!sidebarToggle && "mr-4", "svg-stroke")}
              />
              <span>Settings</span>
            </Link>
          </li>
        </ul>
      </div>
      <div className="sidebar-toggle__btn">
        <button
          onClick={() => setSidebarToggle(!sidebarToggle)}
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

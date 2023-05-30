import brandLogo from "assets/images/brand-logo.svg";
import DashboardIcon from "./DashboardIcon";
import ServiceIcon from "./ServiceIcon";
import SettingIcon from "./SettingIcon";
import DocumentationIcon from "./DocumentationIcon";
import NavLinkItem from "./NavLinkItem";
import NavLinkContainer from "./NavLinkContainer";

const Sidebar = () => {
  return (
    <div className={"sidebar-main sidebar-toggle"}>
      <div className="pt-[18px] flex-col px-2 flex h-screen sidebar">
        <div className="flex">
          <img className="ml-[10px]" src={brandLogo} alt="brandLogo" />
        </div>
        <NavLinkContainer className="my-6 overflow-y-auto flex-grow scrollbar-none">
          <NavLinkItem
            to="/"
            icon={<DashboardIcon className={""} />}
            label="Dashboard"
          />
        </NavLinkContainer>

        <NavLinkContainer className="sidebar-last__row">
          <div className="border-timberwolf opacity-30 -mx-2 pt-[13px]"></div>
          <NavLinkItem
            target="_blank"
            to="https://dev.prem.ninja"
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
    </div>
  );
};

export default Sidebar;

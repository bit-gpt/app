import brandLogo from "assets/images/brand-logo.svg";
import DashboardIcon from "./DashboardIcon";
import SettingIcon from "./SettingIcon";
import DocumentationIcon from "./DocumentationIcon";
import NavLinkItem from "./NavLinkItem";
import NavLinkContainer from "./NavLinkContainer";

const Sidebar = () => {
  return (
    <div className="sidebar-main sidebar-toggle">
      <div className="pt-10 flex-col px-2 flex md:h-screen sidebar max-md:px-4">
        <div className="flex max-md:hidden">
          <img className="ml-[10px]" src={brandLogo} alt="brandLogo" />
        </div>
        <NavLinkContainer className="md:my-6 mt-[60px] overflow-y-auto flex-grow scrollbar-none">
          <NavLinkItem to="/" icon={<DashboardIcon />} label="Dashboard" />
        </NavLinkContainer>

        <NavLinkContainer className="sidebar-last__row max-md:mb-5">
          <div className="border-timberwolf opacity-30 -mx-2 pt-[13px]"></div>
          <NavLinkItem
            target="_blank"
            to="https://github.com/premAI-io/prem-app"
            label="Documentation"
            icon={<DocumentationIcon />}
          />
          <NavLinkItem
            to="/settings"
            label="Settings"
            icon={<SettingIcon className="svg-stroke" />}
          />
        </NavLinkContainer>
      </div>
    </div>
  );
};

export default Sidebar;

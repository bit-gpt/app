import { NavLink } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import type { NavLinkItemProps } from "shared/types";
import { useMediaQuery } from "usehooks-ts";

const NavLinkItem = ({ to, icon, label, target }: NavLinkItemProps) => {
  const onlyDesktopShow = useMediaQuery("(min-width: 768px)");
  return (
    <li>
      <NavLink
        to={to}
        target={target}
        rel="noopener noreferrer"
        className={({ isActive }) => (isActive ? "active" : "")}
        data-tooltip-id="sidebar-tooltip"
        data-tooltip-content={label}
      >
        {icon}
        <span>{label}</span>
      </NavLink>
      {onlyDesktopShow && (
        <Tooltip id="sidebar-tooltip" place="left" className="tooltip" noArrow={true} />
      )}
    </li>
  );
};

export default NavLinkItem;

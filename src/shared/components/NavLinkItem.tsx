import { NavLink } from "react-router-dom";
import "react-tooltip/dist/react-tooltip.css";
import { Tooltip } from "react-tooltip";
import { NavLinkItemProps } from "shared/types";

const NavLinkItem = ({ to, icon, label, target }: NavLinkItemProps) => {
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
      <Tooltip
        id="sidebar-tooltip"
        place="left"
        className="tooltip"
        noArrow={true}
      />
    </li>
  );
};

export default NavLinkItem;

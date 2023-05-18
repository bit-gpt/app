import { NavLink } from "react-router-dom";
import { NavLinkItemProps } from "shared/types";

const NavLinkItem = ({ to, icon, label }: NavLinkItemProps) => {
  return (
    <li>
      <NavLink to={to} className={({ isActive }) => (isActive ? "active" : "")}>
        {icon}
        <span>{label}</span>
      </NavLink>
    </li>
  );
};

export default NavLinkItem;

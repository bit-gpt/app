import "react-tooltip/dist/react-tooltip.css";

import clsx from "clsx";
import { NavLink } from "react-router-dom";
import { Tooltip } from "react-tooltip";
import type { NavLinkItemProps } from "shared/types";
import { useMediaQuery } from "usehooks-ts";

import useSettingStore from "../store/setting";

const NavLinkItem = ({ to, icon, label, target, newFeature = false }: NavLinkItemProps) => {
  const onlyDesktopShow = useMediaQuery("(min-width: 768px)");
  const setNewFeature = useSettingStore((state) => state.setNewFeature);

  return (
    <li>
      <NavLink
        to={to}
        target={target}
        rel="noopener noreferrer"
        className={({ isActive }) => clsx({ active: isActive }, "relative")}
        data-tooltip-id="sidebar-tooltip"
        data-tooltip-content={label}
        onClick={() => newFeature && setNewFeature(false)}
      >
        {newFeature ? (
          <div className="w-2 h-2 bg-danger rounded-full absolute top-[9px] right-[9px]"></div>
        ) : null}
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

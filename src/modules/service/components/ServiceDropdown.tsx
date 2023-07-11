import { useState } from "react";
import cross from "assets/images/dot.svg";
import clsx from "clsx";

const ServiceDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  return (
    <>
      <button className="red-badge" onClick={() => setDropdownOpen(!dropdownOpen)}>
        <img src={cross} alt="cross" width={22} height={22} className="w-6 h-6" />
      </button>
      <ul className={clsx("dropdown-menu", { "dropdown-active": dropdownOpen })}>
        <li>Start</li>
        <li>Restart</li>
        <li>Delete</li>
        <li className="red-badge">Update</li>
      </ul>
    </>
  );
};

export default ServiceDropdown;

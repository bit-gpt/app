import { useRef } from "react";
import CheckeBox from "./CheckeBox";
import { DropdownProps } from "../types";
import CloseIcon from "shared/components/CloseIcon";

const Dropdown = ({ isActive, setIsActive }: DropdownProps) => {
  const dropdownRef = useRef(null);
  return (
    <>
      <nav
        ref={dropdownRef}
        className={`dropdown-menu ${isActive && "dropdown-active"}`}
      >
        <div className="text-right">
          <button
            onClick={() => setIsActive(false)}
            className="w-[30px] h-[30px] text-center"
          >
            <CloseIcon className="mx-auto" />
          </button>
        </div>
        <h3 className="font-medium text-base text-white mb-6">Filter Search</h3>
        <ul>
          <li>
            <CheckeBox label="PREM Chat" checked={true} />
          </li>
          <li>
            <CheckeBox label="PREM Michaelangelo" checked={true} />
          </li>
          <li>
            <CheckeBox label="PREM Audio" checked={true} />
          </li>
          <li>
            <CheckeBox label="PREM Copilot" checked={true} />
          </li>
          <li className="mt-[10px]">
            <button className="bg-americanpink p-2 font-proximaNova-regular text-[10px] text-white rounded-md w-full">
              Show Search Filter
            </button>
          </li>
        </ul>
      </nav>
    </>
  );
};

export default Dropdown;

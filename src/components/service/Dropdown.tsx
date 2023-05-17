import { useRef, useState } from "react";
import { Close } from "../../shared/Icon";
import CheckeBox from "./CheckeBox";

const Dropdown = ({ isActive, setIsActive }: any) => {
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
            <Close className="mx-auto" />
          </button>
        </div>
        <h3 className="font-medium text-base text-white mb-6">Filter Search</h3>
        <ul>
          <li>
            <CheckeBox label="PREM Chat" />
          </li>
          <li>
            <CheckeBox label="PREM Michaelangelo" />
          </li>
          <li>
            <CheckeBox label="PREM Audio" />
          </li>
          <li>
            <CheckeBox label="PREM Copilot" />
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

import { useState } from "react";
import clsx from "clsx";
import CloseIcon from "shared/components/CloseIcon";
import CheckeBox from "./CheckeBox";
import { DropdownProps } from "../types";

const Dropdown = ({ open, close, apps, onFilterChange }: DropdownProps) => {
  const [search, setSearch] = useState(
    new Map<string, boolean>(apps.map((app) => [app.id, true]))
  );

  return (
    <nav className={clsx(`dropdown-menu`, { "dropdown-active": open })}>
      <div className="text-right">
        <button onClick={close} className="w-[30px] h-[30px] text-center">
          <CloseIcon className="mx-auto" />
        </button>
      </div>
      <h3 className="font-medium text-base text-white mb-6">Filter Search</h3>
      <ul>
        {apps.map((app) => (
          <li key={app.id}>
            <CheckeBox
              onChange={(e) => {
                search.set(app.id, e.target.checked);
                setSearch(new Map(search.entries()));
                onFilterChange(search);
              }}
              label={app.name}
              checked={search.get(app.id) as boolean}
            />
          </li>
        ))}
        <li className="mt-[10px]">
          <button className="bg-americanpink p-2 font-proximaNova-regular text-[10px] text-white rounded-md w-full">
            Show Search Filter
          </button>
        </li>
      </ul>
    </nav>
  );
};

export default Dropdown;

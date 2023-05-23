import { useEffect, useState } from "react";
import clsx from "clsx";
import CloseIcon from "shared/components/CloseIcon";
import CheckeBox from "./CheckeBox";
import { DropdownProps } from "../types";

const Dropdown = ({
  open,
  close,
  apps,
  onFilterChange,
  appId,
}: DropdownProps) => {
  const [search, setSearch] = useState(new Map());

  useEffect(() => {
    setSearch(
      new Map<string, boolean>(
        apps.map((app) => [app.id, !appId || app.id === appId])
      )
    );
  }, [appId]);

  const handleSearch = (appId: string, status: boolean) => {
    const newSearch = new Map(search.entries());
    newSearch.set(appId, status);
    setSearch(newSearch);
  };

  useEffect(() => {
    onFilterChange(search);
  }, [search]);

  if (search.size === 0) return null;

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
                handleSearch(app.id, e.target.checked);
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

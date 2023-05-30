import searchLogo from "assets/images/search.svg";
import { useEffect, useMemo, useState } from "react";
import Select, { MultiValue } from "react-select";
import { Option, SearchFilterProps } from "../types";
import MultiValueRemove from "./MultiValueRemove";
import { BACKEND_URL, serviceSearchStyle } from "shared/helpers/utils";
import clsx from "clsx";

const SearchFilter = ({ apps, onFilterChange, appId }: SearchFilterProps) => {
  const [search, setSearch] = useState(new Map());

  useEffect(() => {
    const newSearch = new Map(apps.map((app) => [app.id, app.id === appId]));
    setSearch(newSearch);
  }, [appId]);

  useEffect(() => {
    onFilterChange(search);
  }, [search]);

  const handleSearch = (appId: string) => {
    const newSearch = new Map(search.entries());
    newSearch.set(appId, !newSearch.get(appId));
    setSearch(newSearch);
  };

  const onSelectChange = (newValue: MultiValue<Option>) => {
    const newSearch = new Map<string, boolean>(
      apps.map((app) => [app.id, false])
    );
    newValue.forEach((option: Option) => {
      newSearch.set(option.value, true);
    });
    setSearch(newSearch);
  };

  const options = useMemo(() => {
    return apps.map((app) => ({
      value: app.id,
      label: app.name,
    }));
  }, [apps]);

  const selectedApps = useMemo(() => {
    return apps
      .filter((app) => search.get(app.id) as boolean)
      .map((app) => ({ value: app.id, label: app.name }));
  }, [apps, search]);

  if (search.size === 0) return null;

  return (
    <div>
      <div className="relative search-filter">
        <img
          src={searchLogo}
          alt="search"
          width="18"
          height="18"
          className="absolute left-[20px] top-[12px]"
        />
        <Select
          styles={serviceSearchStyle}
          options={options}
          isMulti
          placeholder="Search"
          isClearable={false}
          onChange={onSelectChange}
          value={selectedApps}
          components={{
            MultiValueRemove,
            DropdownIndicator: () => null,
            IndicatorSeparator: () => null,
          }}
        />
      </div>
      <div className="flex justify-around mx-44 mt-2">
        {apps.map((app) => (
          <div
            className={clsx("text-white", {
              "bg-tulip  rounded": search.get(app.id),
            })}
            key={app.id}
          >
            <button className="flex p-1" onClick={() => handleSearch(app.id)}>
              <img
                src={`${BACKEND_URL}${app.icon}`}
                alt={app.name}
                width="20"
                height="20"
                className="mr-2 rounded"
              />
              <span>{app.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;

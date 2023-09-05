import searchLogo from "assets/images/search.svg";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import type { MultiValue } from "react-select";
import Select from "react-select";
import { serviceSearchStyle } from "shared/helpers/utils";

import api from "../../../shared/api/v1";
import type { App, Option, SearchFilterProps } from "../types";

import MultiValueRemove from "./MultiValueRemove";

const SearchFilter = ({ apps, onFilterChange, appId }: SearchFilterProps) => {
  const [search, setSearch] = useState(new Map());

  useEffect(() => {
    const newSearch = new Map(apps.map((app) => [app.id, app.id === appId]));
    setSearch(newSearch);
  }, [appId, apps]);

  useEffect(() => {
    onFilterChange(search);
  }, [onFilterChange, search]);

  const handleSearch = (appId: string) => {
    const newSearch = new Map(search.entries());
    newSearch.set(appId, !newSearch.get(appId));
    setSearch(newSearch);
  };

  const onSelectChange = (newValue: MultiValue<Option>) => {
    const newSearch = new Map<string, boolean>(apps.map((app) => [app.id, false]));
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

  const Image = (app: App) => {
    const [imageSrc, setImageSrc] = useState("");
    useEffect(() => {
      (async () => {
        const response = await api().get(app.icon.replace(/^\/+/, ""));
        if (response.status === 200) {
          const objectURL = URL.createObjectURL(response.data);
          setImageSrc(objectURL);
        } else {
          console.error("Failed to fetch image");
        }
      })();
    }, [app.icon]);
    return imageSrc ? <img src={imageSrc} alt={app.name} className="mr-2 w-4 h-4 rounded" /> : null;
  };

  if (search.size === 0) return null;

  return (
    <div>
      <div className="relative search-filter">
        <img
          src={searchLogo}
          alt="search"
          width="18"
          height="18"
          className="absolute left-[20px] top-[15px]"
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
      <div className="flex md:justify-center flex-wrap lg:gap-6 gap-4 mt-5">
        {apps.map((app) => (
          <div
            className={clsx("text-white", {
              "bg-[#F4A597] rounded": search.get(app.id),
            })}
            key={app.id}
          >
            <button
              className="flex px-2 py-[6px] items-center text-sm"
              onClick={() => handleSearch(app.id)}
            >
              <Image {...app} />
              <span>{app.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;

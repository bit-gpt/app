import searchLogo from "assets/images/search.svg";
import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import type { MultiValue } from "react-select";
import Select from "react-select";
import { serviceSearchStyle } from "shared/helpers/utils";

import api from "../../../shared/api/v1";
import type { Option, SearchFilterProps } from "../types";

import MultiValueRemove from "./MultiValueRemove";

const SearchFilter = ({ apps, onFilterChange }: SearchFilterProps) => {
  const [search, setSearch] = useState(new Map());
  const [icons, setIcons] = useState<Record<string, string>>({});

  useEffect(() => {
    (async () => {
      try {
        const updatedIcons: Record<string, string> = {};
        const requests = apps.map(async (app) => {
          const response = await api().get(app.icon.replace(/^\/+/, ""));
          if (response.status === 200) {
            const parser = new DOMParser();
            const svgDOM = parser.parseFromString(response.data, "image/svg+xml");
            svgDOM.documentElement.setAttribute("width", "16");
            svgDOM.documentElement.setAttribute("height", "16");
            updatedIcons[app.id] = new XMLSerializer().serializeToString(svgDOM);
          } else {
            console.error("Failed to fetch image for app with ID:", app.id);
          }
        });
        await Promise.all(requests);
        setIcons(updatedIcons);
      } catch (error) {
        console.error("An error occurred while fetching or processing icons:", error);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const newSearch = new Map(apps.map((app) => [app.id, false]));
    setSearch(newSearch);
  }, [apps]);

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

  if (search.size === 0) return null;

  return (
    <div className="flex flex-col items-center">
      <div className="relative search-filter w-full">
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
      <div className="flex justify-center flex-wrap gap-y-5 gap-x-6 lg:gap-x-7 mt-5 md:w-4/5">
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
              <div dangerouslySetInnerHTML={{ __html: icons?.[app.id] }} className="mr-2 rounded" />
              <span>{app.name}</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchFilter;

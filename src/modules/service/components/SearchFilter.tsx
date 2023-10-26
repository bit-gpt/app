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
  const [icons, setIcons] = useState<Record<string, string>>({});
  const [tags, setTags] = useState<App[]>([]);

  useEffect(() => {
    (async () => {
      const tagsVar = apps.concat({
        id: "available-services",
        name: "Available",
        playground: false,
        documentation: "",
        icon: "https://raw.githubusercontent.com/astrit/css.gg/master/icons/svg/smile-mouth-open.svg",
      });
      setTags(tagsVar);

      try {
        const updatedIcons: Record<string, string> = {};
        const requests = tagsVar.map(async (app) => {
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
    const newSearch = new Map(tags.map((app) => [app.id, app.id === appId]));
    setSearch(newSearch);
  }, [appId, tags]);

  useEffect(() => {
    onFilterChange(search);
  }, [onFilterChange, search]);

  const handleSearch = (appId: string) => {
    const newSearch = new Map(search.entries());
    newSearch.set(appId, !newSearch.get(appId));
    setSearch(newSearch);
  };

  const onSelectChange = (newValue: MultiValue<Option>) => {
    const newSearch = new Map<string, boolean>(tags.map((app) => [app.id, false]));
    newValue.forEach((option: Option) => {
      newSearch.set(option.value, true);
    });
    setSearch(newSearch);
  };

  const options = useMemo(() => {
    return tags.map((app) => ({
      value: app.id,
      label: app.name,
    }));
  }, [tags]);

  const selectedApps = useMemo(() => {
    return tags
      .filter((app) => search.get(app.id) as boolean)
      .map((app) => ({ value: app.id, label: app.name }));
  }, [tags, search]);

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
        {tags.map((app) => (
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

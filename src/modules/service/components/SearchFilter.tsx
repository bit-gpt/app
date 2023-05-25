import searchLogo from "assets/images/search.svg";
import filterLogo from "assets/images/filter.svg";
import Dropdown from "./Dropdown";
import { useEffect, useMemo, useState } from "react";
import Select, { MultiValue } from "react-select";
import { Option, SearchFilterProps } from "../types";
import MultiValueRemove from "./MultiValueRemove";
import { serviceSearchStyle } from "shared/helpers/utils";

const SearchFilter = ({ apps, onFilterChange, appId }: SearchFilterProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [search, setSearch] = useState(new Map());

  useEffect(() => {
    const newSearch = new Map(apps.map((app) => [app.id, app.id === appId]));
    setSearch(newSearch);
  }, [appId]);

  useEffect(() => {
    onFilterChange(search);
  }, [search]);

  const toggleDropdown = () => {
    setOpenDropdown(!openDropdown);
  };

  const handleSearch = (appId: string, status: boolean) => {
    const newSearch = new Map(search.entries());
    newSearch.set(appId, status);
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
      <button
        onClick={toggleDropdown}
        className="absolute right-[5px] top-0 w-[40px] h-[40px] text-center"
      >
        <img
          src={filterLogo}
          alt="filter"
          width="18"
          height="18"
          className="mx-auto"
        />
      </button>
      {apps.length > 0 && (
        <Dropdown
          open={openDropdown}
          close={() => setOpenDropdown(false)}
          apps={apps}
          search={search}
          onChange={handleSearch}
        />
      )}
    </div>
  );
};

export default SearchFilter;

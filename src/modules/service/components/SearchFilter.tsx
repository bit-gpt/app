import searchLogo from "assets/images/search.svg";
import filterLogo from "assets/images/filter.svg";
import Dropdown from "./Dropdown";
import { useEffect, useMemo, useState } from "react";
import Select, {
  CSSObjectWithLabel,
  ControlProps,
  MultiValue,
} from "react-select";
import { Option, SearchFilterProps } from "../types";
import MultiValueRemove from "./MultiValueRemove";

const selectStyles = {
  control: (base: CSSObjectWithLabel, state: ControlProps<Option>) => ({
    ...base,
    backgroundColor: "rgba(77, 77, 79, 0.22)",
    borderColor: state.isFocused ? "transparent" : "transparent",
    padding: 3,
    paddingLeft: 40,
    "&:hover": {
      cursor: "pointer",
      "state.isFocused": {
        borderColor: "transparent",
        backgroundColor: "rgba(77, 77, 79, 0.22)",
        boxShadown: "0",
      },
    },
  }),
  multiValue: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: "transparent",
    border: "1px solid #EDEDED",
    borderRadius: 4,
    padding: "3px 8px",
    alignItems: "center",
    fontFamily: "ProximaNova-Regular",
  }),
  multiValueLabel: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#EDEDED",
    padding: "3px 8px",
    fontSize: 12,
  }),
  multiValueRemove: () => ({
    "&:hover": {
      backgroundColor: "transparent",
    },
  }),
  menuList: (base: CSSObjectWithLabel) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 0,
  }),
  noOptionsMessage: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: "#20232b",
  }),
  option: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: "#20232b",
    color: "#EDEDED",
    fontSize: 12,
    fontFamily: "ProximaNova-Regular",
    "&:hover": {
      backgroundColor: "#323232",
    },
  }),
};

const SearchFilter = ({ apps, onFilterChange, appId }: SearchFilterProps) => {
  const [openDropdown, setOpenDropdown] = useState(false);
  const [search, setSearch] = useState(
    new Map(apps.map((app) => [app.id, !appId || app.id === appId]))
  );

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
        styles={selectStyles}
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

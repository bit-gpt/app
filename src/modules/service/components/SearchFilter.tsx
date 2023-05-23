import searchLogo from "assets/images/search.svg";
import filterLogo from "assets/images/filter.svg";
import Dropdown from "./Dropdown";
import { useEffect, useMemo, useState } from "react";
import Select, { MultiValue, components } from "react-select";
import { Option, SearchFilterProps } from "../types";

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

  const selectStyles = {
    control: (base: any, state: any) => ({
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
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: "transparent",
      border: "1px solid #EDEDED",
      borderRadius: 4,
      padding: "3px 8px",
      alignItems: 'center',
      fontFamily: "ProximaNova-Regular",
    }),
    multiValueLabel: (base: any) => ({
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
    menuList: (base: any) => ({
      ...base,
      paddingTop: 0,
      paddingBottom: 0,
      borderRadius: 0,
    }),
    noOptionsMessage: (base: any) => ({
      ...base,
      backgroundColor: '#20232b'
    }),
    option: (base: any) => ({
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

  const MultiValueRemove = (props:any) => {
    return (
      <components.MultiValueRemove {...props}>
        <svg
          width="10"
          height="10"
          viewBox="0 0 9 9"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <g opacity="0.5" clipPath="url(#clip0_1127_6825)">
            <path
              d="M6.26513 3.26512L5.03025 4.5L6.26513 5.73488L5.73488 6.26513L4.5 5.03025L3.26512 6.26513L2.73488 5.73488L3.96975 4.5L2.73488 3.26512L3.26512 2.73488L4.5 3.96975L5.73488 2.73488L6.26513 3.26512ZM9 4.5C9 6.98138 6.98138 9 4.5 9C2.01863 9 0 6.98138 0 4.5C0 2.01863 2.01863 0 4.5 0C6.98138 0 9 2.01863 9 4.5ZM8.25 4.5C8.25 2.43225 6.56775 0.75 4.5 0.75C2.43225 0.75 0.75 2.43225 0.75 4.5C0.75 6.56775 2.43225 8.25 4.5 8.25C6.56775 8.25 8.25 6.56775 8.25 4.5Z"
              fill="#EDEDED"
            />
          </g>
          <defs>
            <clipPath id="clip0_1127_6825">
              <rect width="9" height="9" fill="white" />
            </clipPath>
          </defs>
        </svg>
      </components.MultiValueRemove>
    );
  };

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
        placeholder="Search in PREM Chat"
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

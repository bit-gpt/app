import searchLogo from "assets/images/search.svg";
import filterLogo from "assets/images/filter.svg";
import Dropdown from "./Dropdown";
import { PropsWithChildren, useState } from "react";

type SearchFilterProps = PropsWithChildren<{
  toggleDropdown: () => void;
}>;

const SearchFilter = ({ toggleDropdown, children }: SearchFilterProps) => {

  return (
    <div className="relative search-filter">
      <img
        src={searchLogo}
        alt="search"
        width="18"
        height="18"
        className="absolute left-[20px] top-[10px]"
      />
      <input placeholder="Search" className="mb-16" />
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
      {children}
    </div>
  );
};

export default SearchFilter;

import { components } from "react-select";
import type { MultiValueRemoveProps } from "react-select";

import type { Option } from "../types";

const MultiValueRemove = (props: MultiValueRemoveProps<Option>) => {
  return (
    <components.MultiValueRemove {...props}>
      <svg width="10" height="10" viewBox="0 0 9 9" fill="none" xmlns="http://www.w3.org/2000/svg">
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

export default MultiValueRemove;

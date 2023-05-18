import { useState } from "react";
import clsx from "clsx";
import { CheckeBoxProps } from "../types";

const CheckeBox = ({ label, checked }: CheckeBoxProps) => {
  const [isChecked, setIsChecked] = useState(checked);

  const toggle = () => {
    setIsChecked((prev) => !prev);
  };

  return (
    <label>
      <input
        type="checkbox"
        onChange={toggle}
        className={clsx({ checked: isChecked })}
        checked={isChecked}
      />
      <span>{label}</span>
    </label>
  );
};

export default CheckeBox;

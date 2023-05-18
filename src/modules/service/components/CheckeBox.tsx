import clsx from "clsx";
import { CheckeBoxProps } from "../types";

const CheckeBox = ({ label, checked, onChange }: CheckeBoxProps) => {
  return (
    <label>
      <input
        type="checkbox"
        onChange={onChange}
        className={clsx({ checked })}
        checked={checked}
      />
      <span>{label}</span>
    </label>
  );
};

export default CheckeBox;

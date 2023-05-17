import { useState } from "react";

const CheckeBox = ({label}:any) => {
  const [isChecked, setIsChecked] = useState("checked" ? "checked" : false);
  return (
    <label>
      <input
        type="checkbox"
        onChange={() => setIsChecked((prev: any) => !prev)}
        className={isChecked ? "checked" : ""}
        defaultChecked={isChecked ? "checked" : "" }
      />
      <span>{label}</span>
    </label>
  );
};

export default CheckeBox;

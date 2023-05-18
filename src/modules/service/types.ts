export type CheckeBoxProps = {
  label: string;
  checked: boolean;
};

export type DropdownProps = {
    isActive: boolean;
    setIsActive: (value: boolean) => void;
  };
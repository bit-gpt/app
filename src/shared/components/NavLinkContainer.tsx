import type { HTMLAttributes, PropsWithChildren } from "react";

const NavLinkContainer = ({
  children,
  ...rest
}: PropsWithChildren<HTMLAttributes<HTMLUListElement>>) => {
  return <ul {...rest}>{children}</ul>;
};

export default NavLinkContainer;

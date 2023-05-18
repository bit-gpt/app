import { PropsWithChildren, ReactElement, useCallback, useState } from "react";
import clsx from "clsx";
import Sidebar from "./Sidebar";

const AppContainer = ({ children }: PropsWithChildren) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const toggle = useCallback(() => {
    setSidebarToggle((prev) => !prev);
  }, [setSidebarToggle]);

  return (
    <section className="bg-darkjunglegreen min-h-screen flex w-full relative">
      <Sidebar toggle={toggle} toggleStatus={sidebarToggle} />
      <div
        className={clsx(
          "container pt-[80px] px-3 mx-auto z-10 relative",
          !sidebarToggle ? "ml-[300px]" : "ml-[100px]"
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default AppContainer;

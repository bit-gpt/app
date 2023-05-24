import { PropsWithChildren, ReactElement, useCallback, useState } from "react";
import clsx from "clsx";
import Sidebar from "./Sidebar";

const AppContainer = ({ children }: PropsWithChildren) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const toggle = useCallback(() => {
    setSidebarToggle((prev) => !prev);
  }, [setSidebarToggle]);

  return (
    <section className="bg-darkjunglegreen min-h-screen flex w-full relative gradient-effect">
      <Sidebar toggle={toggle} toggleStatus={sidebarToggle} />
      <div
        className={clsx(
          "container pt-[80px] pb-[60px] px-3 mx-auto z-10 relative",
          !sidebarToggle ? "ml-[300px] mr-[40px]" : "ml-[120px] mr-[40px]"
        )}
      >
        {children}
      </div>
    </section>
  );
};

export default AppContainer;

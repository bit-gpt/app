import { PropsWithChildren, ReactElement, useCallback, useState } from "react";
import Sidebar from "./Sidebar";

const AppContainer = ({ children }: PropsWithChildren) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const toggle = useCallback(() => {
    setSidebarToggle((prev) => !prev);
  }, [setSidebarToggle]);

  return (
    <section className="bg-darkjunglegreen relative gradient-effect">
     <div className="max-w-[1723px] mx-auto min-h-screen flex w-full">
      <Sidebar />
      <div
        className={
          "container pb-[60px] px-3 mx-auto z-[1] relative md:ml-[120px] md:mr-[40px] ml-[80px] mr-[10px]"
        }
      >
        {children}
      </div>
      </div>
    </section>
  );
};

export default AppContainer;

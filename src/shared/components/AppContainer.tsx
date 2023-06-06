import { PropsWithChildren, ReactElement, useCallback, useState } from "react";
import Sidebar from "./Sidebar";

const AppContainer = ({ children }: PropsWithChildren) => {
  const [sidebarToggle, setSidebarToggle] = useState(false);

  const toggle = useCallback(() => {
    setSidebarToggle((prev) => !prev);
  }, [setSidebarToggle]);

  return (
    <section className="bg-darkjunglegreen">
      <div className="min-h-screen flex w-full">
        <Sidebar />
        <div className="main-container">{children}</div>
      </div>
    </section>
  );
};

export default AppContainer;

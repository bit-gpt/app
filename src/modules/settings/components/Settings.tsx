import cross from "assets/images/cross.svg";
import hamburgerMenu from "assets/images/hamburger-menu.svg";
import clsx from "clsx";
import { useCallback, useEffect, useState } from "react";
import AppContainer from "shared/components/AppContainer";
import Sidebar from "shared/components/Sidebar";
import { useLockedBody, useMediaQuery } from "usehooks-ts";

import AdvancedSettings from "./AdvancedSettings";
import GPUResources from "./GPUResources";
import SystemResources from "./SystemResources";

const Settings = () => {
  const matches = useMediaQuery("(max-width: 767px)");
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(false);
  const [bodyLocked, setBodyLocked] = useLockedBody(false, "root");

  const hamburgerMenuToggle = useCallback(() => {
    setBodyLocked(!bodyLocked);
    setHamburgerMenu(!hamburgerMenuOpen);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-empty-function
  useEffect(() => {}, [hamburgerMenuToggle]);

  return (
    <AppContainer>
      {hamburgerMenuOpen && (
        <button
          onClick={hamburgerMenuToggle}
          className="w-[40px] md:hidden z-[11] fixed right-[14px] top-[24px]"
        >
          <img src={cross} alt="cross" width={26} height={26} className="mx-auto" />
        </button>
      )}
      <div className={clsx(hamburgerMenuOpen && matches ? "flex" : "maxMd:hidden")}>
        {hamburgerMenuOpen && <Sidebar />}
      </div>
      <div className="maxMd:pb-12 maxMd:relative maxMd:h-full">
        <button onClick={hamburgerMenuToggle} className="md:hidden -mx-3 mt-5 w-10 h-10 z-[11]">
          <img src={hamburgerMenu} alt="msg" width={22} height={22} className="mx-auto" />
        </button>
        <div className="mask-heading md:mb-14 mb-6 md:-mx-6 xl:-mx-10">
          <h2 className="!mt-10">Settings</h2>
        </div>
        <div className="lg:max-w-[80%] mx-auto settings">
          <SystemResources />
        </div>
        <div className="lg:max-w-[80%] mx-auto settings maxMd:hidden">
          <GPUResources />
        </div>
        <div className="lg:max-w-[80%] mx-auto settings">
          <AdvancedSettings />
        </div>
      </div>
    </AppContainer>
  );
};

export default Settings;

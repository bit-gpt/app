import clsx from "clsx";
import { useState } from "react";

import type { PremTextAudioContainerProps } from "../types";

import Header from "./Header";
import PremTextAudioBox from "./PremTextAudioBox";
import PremTextAudioLeftSidebar from "./PremTextAudioLeftSidebar";
import PremTextAudioRightSidebar from "./PremTextAudioRightSidebar";

const PremTextAudioContainer = ({
  serviceName,
  serviceId,
  historyId,
}: PremTextAudioContainerProps) => {
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <div
          className={clsx("prem-chat-sidebar md:relative", { "maxMd:hidden": hamburgerMenuOpen })}
        >
          <PremTextAudioLeftSidebar setHamburgerMenu={setHamburgerMenu} />
        </div>
        <div className="flex flex-1">
          <div className="bg-lines bg-darkjunglegreen relative h-full w-full">
            <div className="main-content h-full z-10 overflow-y-auto custom-scroll relative prem-img-services min-h-screen">
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={serviceName}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <PremTextAudioBox serviceId={serviceId} historyId={historyId} />
            </div>
          </div>
        </div>
        <div>{rightSidebar && <PremTextAudioRightSidebar setRightSidebar={setRightSidebar} />}</div>
      </div>
    </section>
  );
};

export default PremTextAudioContainer;

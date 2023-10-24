import clsx from "clsx";
import { useState } from "react";
import { useMediaQuery } from "usehooks-ts";

import type { PremAudioContainerProps } from "../types";

import Header from "./Header";
import PremAudioBox from "./PremAudioBox";
import PremAudioLeftSidebar from "./PremAudioLeftSidebar";
import PremImageRightSidebar from "./PremAudioRightSidebar";

const PremAudioContainer = ({
  serviceName,
  serviceId,
  serviceType,
  historyId,
}: PremAudioContainerProps) => {
  const [rightSidebar, setRightSidebar] = useState(false);
  const responsiveMatches = useMediaQuery("(max-width: 767px)");
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <div
          className={clsx("prem-chat-sidebar md:relative", {
            hidden: responsiveMatches && hamburgerMenuOpen,
          })}
        >
          <PremAudioLeftSidebar setHamburgerMenu={setHamburgerMenu} />
        </div>
        <div className="flex flex-1">
          <div className="bg-lines bg-grey-900 relative h-full w-full">
            <div className="main-content h-full z-10 overflow-y-auto custom-scroll relative prem-img-services min-h-screen">
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={serviceName}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <PremAudioBox serviceId={serviceId} serviceType={serviceType} historyId={historyId} />
            </div>
          </div>
        </div>
        <div>{rightSidebar && <PremImageRightSidebar setRightSidebar={setRightSidebar} />}</div>
      </div>
    </section>
  );
};

export default PremAudioContainer;

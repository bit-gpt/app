import { useState } from "react";

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
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <PremAudioLeftSidebar
          hamburgerMenuOpen={hamburgerMenuOpen}
          setHamburgerMenu={setHamburgerMenu}
          serviceId={serviceId}
          serviceType={serviceType}
          historyId={historyId ?? ""}
        />
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

import { useState } from "react";
import usePremUpscaler from "shared/hooks/usePremUpscaler";

import type { PremUpscalerContainerProps } from "../types";

import Header from "./Header";
import PremUpscalerBox from "./PremUpscalerBox";
import PremUpscalerImageBox from "./PremUpscalerImageBox";
import PremUpscalerLeftSidebar from "./PremUpscalerLeftSidebar";
import PremUpscalerRightSidebar from "./PremUpscalerRightSidebar";

const PremUpscalerContainer = ({
  serviceName,
  serviceId,
  serviceType,
  historyId,
}: PremUpscalerContainerProps) => {
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);
  const { currentHistory } = usePremUpscaler(serviceId!, serviceType!, historyId);

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <PremUpscalerLeftSidebar
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
              {currentHistory && (
                <PremUpscalerImageBox
                  serviceId={serviceId}
                  history={currentHistory}
                  serviceType={serviceType}
                />
              )}
              {!currentHistory && <PremUpscalerBox serviceId={serviceId} historyId={historyId} />}
            </div>
          </div>
        </div>
        <div>{rightSidebar && <PremUpscalerRightSidebar setRightSidebar={setRightSidebar} />}</div>
      </div>
    </section>
  );
};

export default PremUpscalerContainer;

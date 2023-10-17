import clsx from "clsx";
import { useState } from "react";
import usePremUpscaler from "shared/hooks/usePremUpscaler";
import { useMediaQuery } from "usehooks-ts";

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
  const responsiveMatches = useMediaQuery("(max-width: 767px)");
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);
  const { currentHistory } = usePremUpscaler(serviceId!, serviceType!, historyId);

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <div
          className={clsx("prem-chat-sidebar md:relative", {
            hidden: responsiveMatches && hamburgerMenuOpen,
          })}
        >
          <PremUpscalerLeftSidebar setHamburgerMenu={setHamburgerMenu} />
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

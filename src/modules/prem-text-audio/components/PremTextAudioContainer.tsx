import { useState } from "react";
import clsx from "clsx";
import PremTextAudioLeftSidebar from "./PremTextAudioLeftSidebar";
import Header from "./Header";
import PremTextAudioRightSidebar from "./PremTextAudioRightSidebar";
import { PremTextAudioContainerProps } from "../types";
import PremTextAudioBox from "./PremTextAudioBox";

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
          className={clsx("prem-chat-sidebar md:relative", hamburgerMenuOpen && "maxMd:hidden")}
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

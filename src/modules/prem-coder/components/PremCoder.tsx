import { useState } from "react";
import { useParams } from "react-router-dom";

import LeftSidebar from "../../../shared/components/LeftSidebar";
import PlayGroundSpinner from "../../../shared/components/PlayGroundSpinner";
import useGetService from "../../../shared/hooks/useGetService";
import Header from "../../prem-audio/components/Header";
import type { Service } from "../../service/types";

const PremCoder = () => {
  const [rightSidebar, setRightSidebar] = useState(false);
  const [hamburgerMenuOpen, setHamburgerMenu] = useState<boolean>(true);
  const { serviceId, serviceType } = useParams<{
    serviceId: string;
    serviceType: Service["serviceType"];
  }>();

  const { data: service, isLoading } = useGetService(serviceId!, serviceType!);

  if (isLoading) {
    return <PlayGroundSpinner />;
  }

  return (
    <section>
      <div className="md:flex md:h-screen w-full relative">
        <LeftSidebar
          hamburgerMenuOpen={hamburgerMenuOpen}
          setHamburgerMenu={setHamburgerMenu}
          serviceId={serviceId ?? ""}
          serviceType={serviceType ?? "docker"}
        />
        <div className="flex flex-1">
          <div className="bg-lines bg-grey-900 relative h-full w-full">
            <div className="main-content h-full z-10 overflow-y-auto custom-scroll relative prem-img-services min-h-screen">
              <Header
                hamburgerMenuOpen={hamburgerMenuOpen}
                setHamburgerMenu={setHamburgerMenu}
                title={service?.name ?? ""}
                setRightSidebar={setRightSidebar}
                rightSidebar={rightSidebar}
              />
              <div className="mx-10 text-xl mt-5">
                <p className="text-white">
                  Please install the VSCode extension at{" "}
                  <span className="text-primary">
                    https://marketplace.visualstudio.com/items?itemName=TabbyML.vscode-tabby
                  </span>{" "}
                  or JetBrains plugin at{" "}
                  <span className="text-primary">
                    https://plugins.jetbrains.com/plugin/22379-tabby
                  </span>
                </p>
                <p className="text-white mt-5">{`Tabby API endpoint: http://localhost:${service?.defaultExternalPort}`}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default PremCoder;

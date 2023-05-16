import { useState } from "react";
import chatLogo from "../assets/images/chat.svg";
import searchLogo from "../assets/images/search.svg";
import Sidebar from "../shared/components/Sidebar";
import ServicesCard from "../shared/components/ServicesCard";
import clsx from "clsx";


const Service = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  return (
    <section className="service min-h-screen bg-darkjunglegreen flex w-full">
      <Sidebar
        setSidebarToggle={setSidebarToggle}
        sidebarToggle={sidebarToggle}
      />
      <div
        className={clsx(
          "container pt-[80px] px-3 mx-auto z-10 relative",
          !sidebarToggle ? "ml-[300px]" : "ml-[100px]"
        )}
      >
        <div className="mask-heading text-center mb-[29px]">
          <h2>Select a Service Type</h2>
        </div>
        <div className="text-center relative">
        <img src={searchLogo} alt="search" width="18" height="18" className="absolute left-[20px] top-[15px]" />
          <input placeholder="Search" className="search-filter mb-16"/>
        </div>
        <div className="flex gap-[22px] flex-wrap">
          <ServicesCard
            icon={chatLogo}
            className="dashboard-bottom__card flex-wrap !pr-5"
            title="Vicuna 7B 4-Bit"
          />
          <ServicesCard
            icon={chatLogo}
            className="dashboard-bottom__card flex-wrap !pr-5 services-running"
            title="Vicuna 7B 4-Bit"
          />
          <ServicesCard
            icon={chatLogo}
            className="dashboard-bottom__card flex-wrap !pr-5"
            title="Vicuna 7B 4-Bit"
          />
          <ServicesCard
            icon={chatLogo}
            className="dashboard-bottom__card flex-wrap !pr-5"
            title="Vicuna 7B 4-Bit"
          />
        </div>
      </div>
    </section>
  );
};

export default Service;

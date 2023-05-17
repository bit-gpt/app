import { useState } from "react";
import chatLogo from "../assets/images/chat.svg";
import searchLogo from "../assets/images/search.svg";
import filterLogo from "../assets/images/filter.svg";
import Sidebar from "../shared/components/Sidebar";
import ServicesCard from "../shared/components/ServicesCard";
import clsx from "clsx";
import Dropdown from "../components/service/Dropdown";

const Service = () => {
  const [sidebarToggle, setSidebarToggle] = useState(false);
  const [isActive, setIsActive] = useState(false);
  return (
    <section className="service min-h-screen bg-darkjunglegreen flex w-full">
      <Sidebar
        setSidebarToggle={setSidebarToggle}
        sidebarToggle={sidebarToggle}
      />
      <div
        className={clsx(
          "container my-16 xl:py-0 flex-col px-3 mx-auto z-10 relative",
          !sidebarToggle ? "ml-[300px]" : "ml-[100px]"
        )}
      >
        <div className="mask-heading text-center mb-[29px]">
          <h2>Select a Service Type</h2>
        </div>
        <div className="relative search-filter">
          <img
            src={searchLogo}
            alt="search"
            width="18"
            height="18"
            className="absolute left-[20px] top-[10px]"
          />
          <input placeholder="Search" className="mb-16" />
          <button
            onClick={() => setIsActive(!isActive)}
            className="absolute right-[5px] top-0 w-[40px] h-[40px] text-center"
          >
            <img
              src={filterLogo}
              alt="filter"
              width="18"
              height="18"
              className="mx-auto"
            />
          </button>
          <Dropdown isActive={isActive} setIsActive={setIsActive}/>
        </div>
        <div className="flex gap-[22px] flex-wrap justify-center">
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

import { useState } from "react";
import ServicesCard from "shared/components/ServicesCard";
import AppContainer from "shared/components/AppContainer";
import chatLogo from "assets/images/chat.svg";
import searchLogo from "assets/images/search.svg";
import filterLogo from "assets/images/filter.svg";
import Dropdown from "./Dropdown";

const Service = () => {
  const [isActive, setIsActive] = useState(false);
  return (
    <AppContainer>
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
        <Dropdown isActive={isActive} setIsActive={setIsActive} />
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
    </AppContainer>
  );
};

export default Service;

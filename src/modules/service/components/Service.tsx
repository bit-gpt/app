import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { useMemo, useState } from "react";
import ServicesCard from "shared/components/ServicesCard";
import AppContainer from "shared/components/AppContainer";
import { getApps } from "modules/dashboard/api";
import chatLogo from "assets/images/chat.svg";
import SearchFilter from "./SearchFilter";
import Dropdown from "./Dropdown";
import { getServices } from "../api";
import { useParams } from "react-router-dom";

const Service = () => {
  const { appId } = useParams();
  const [openDropdown, setOpenDropdown] = useState(false);
  const toggleDropdown = () => setOpenDropdown((value) => !value);
  const { data: response } = useQuery(["getServices"], getServices);
  const { data: appResponse, isSuccess } = useQuery(["getApps"], getApps);
  const [filter, setFilter] = useState(new Map<string, boolean>());
  const services = response?.data || [];
  const apps = appResponse?.data || [];

  const filteredServices = useMemo(() => {
    if (filter.size === 0) return services;
    return services.filter((service) => {
      const filterdApps = apps.filter((app) => service.apps.includes(app.id));
      return filterdApps.reduce((acc, app) => {
        return acc || (filter.get(app.id) as boolean);
      }, false);
    });
  }, [services, filter]);

  const onStart = (id: string) => {
    console.log("onStart", id);
  };

  const onStop = (id: string) => {
    console.log("onStop", id);
  };

  const onDelete = (id: string) => {
    console.log("onDelete", id);
  };

  return (
    <AppContainer>
      <div className="mask-heading text-center mb-[29px]">
        <h2>Select a Service Type</h2>
      </div>
      <SearchFilter toggleDropdown={toggleDropdown}>
        {isSuccess && (
          <Dropdown
            open={openDropdown}
            close={() => setOpenDropdown(false)}
            apps={apps}
            onFilterChange={setFilter}
            appId={appId as string}
          />
        )}
      </SearchFilter>
      <div className="flex gap-[22px] flex-wrap justify-center">
        {filteredServices.map((service) => (
          <ServicesCard
            key={service.id}
            icon={chatLogo}
            className={clsx("dashboard-bottom__card flex-wrap !pr-5", {
              "services-running": service.running,
            })}
            title={service.name}
            isRunning={service.running}
            onStart={() => onStart(service.id)}
            onStop={() => onStop(service.id)}
            onDelete={() => onDelete(service.id)}
          />
        ))}
        {filteredServices.length === 0 && (
          <div className="text-center text-[#8C8C8C]">No services found</div>
        )}
      </div>
    </AppContainer>
  );
};

export default Service;

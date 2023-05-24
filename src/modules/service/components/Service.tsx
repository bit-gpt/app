import { useQuery } from "@tanstack/react-query";
import clsx from "clsx";
import { MouseEvent, useMemo, useState } from "react";
import ServicesCard from "shared/components/ServicesCard";
import AppContainer from "shared/components/AppContainer";
import { getApps } from "modules/dashboard/api";
import chatLogo from "assets/images/chat.svg";
import SearchFilter from "./SearchFilter";
import { getServices } from "../api";
import { useParams, redirect, useNavigate } from "react-router-dom";

const Service = () => {
  const { appId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading: isServicesLoading } = useQuery(["getServices"], getServices);
  const { data: appResponse } = useQuery(["getApps"], getApps);
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

  const OnClickRedirect = (e: MouseEvent<HTMLDivElement>,id: string) => {
    const classAdd = e.target as HTMLDivElement;
    classAdd.parentElement?.classList.add('z-11');
    navigate(`/services/${id}/detail`);
  };

  return (
    <AppContainer>
      <div className="mask-heading text-center mb-[29px]">
        <h2>Select a Service Type</h2>
      </div>

      {apps.length > 0 && (
        <SearchFilter
          onFilterChange={setFilter}
          appId={appId as string}
          apps={apps}
        />
      )}

      <div className="flex gap-[22px] flex-wrap justify-center">
        {filteredServices.map((service) => (
          <ServicesCard
            key={service.id}
            icon={chatLogo}
            className={clsx("dashboard-bottom__card flex-wrap !pr-5", {
              "services-running": service.running,
            })}
            isWarning={false}
            title={service.name}
            isRunning={service.running}
            OnClickRedirect={(e)=> OnClickRedirect(e,service.id)}
            onStart={() => onStart(service.id)}
            onStop={() => onStop(service.id)}
            onDelete={() => onDelete(service.id)}
          />
        ))}
        {!isServicesLoading && filteredServices.length === 0 && (
          <div className="text-center text-[#8C8C8C]">No services found</div>
        )}
      </div>
    </AppContainer>
  );
};

export default Service;

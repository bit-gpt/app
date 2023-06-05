import clsx from "clsx";
import { useMemo, useState } from "react";
import AppContainer from "shared/components/AppContainer";
import SearchFilter from "./SearchFilter";
import { useParams } from "react-router-dom";
import useInterfaces from "shared/hooks/useInterfaces";
import useServices from "shared/hooks/useServices";
import ServiceCard from "./ServiceCard";

const Service = () => {
  const { appId } = useParams();

  const { data: response, isLoading: isServicesLoading } = useServices();
  const { data: appResponse } = useInterfaces();

  const [filter, setFilter] = useState(new Map<string, boolean>());

  const services = response?.data || [];
  const apps = appResponse?.data || [];

  const filteredApps = useMemo(() => {
    if (filter.size === 0) return apps;
    if (![...filter.values()].includes(true)) return apps;
    return apps.filter((app) => filter.get(app.id) as boolean);
  }, [apps, filter]);

  return (
    <AppContainer>
      <div className="mask-heading mb-[29px] md:-mx-10">
        <h2 className="!mt-10">Dashboard</h2>
      </div>

      {apps.length > 0 && (
        <SearchFilter
          onFilterChange={setFilter}
          appId={appId as string}
          apps={apps}
        />
      )}

      {filteredApps.map((app) => {
        const filteredServices = services.filter((service) =>
          service.interfaces.includes(app.id)
        );
        return (
          <div key={app.id} className="mt-10">
            <h3 className="text-brightgray font-bold md:text-xl text-base flex mb-5">{app.name}</h3>
            <div className="flex gap-[22px] flex-wrap ">
              {filteredServices.map((service) => (
                <ServiceCard
                  key={service.id}
                  icon={service.icon}
                  className={clsx("dashboard-bottom__card flex-wrap", {
                    "services-running": service.running,
                  })}
                  service={service}
                />
              ))}

              {!isServicesLoading && filteredServices.length === 0 && (
                <div className="text-white opacity-70">
                  No services found
                </div>
              )}
              {isServicesLoading && (
                <div className="text-center text-[#8C8C8C]">Loading...</div>
              )}
            </div>
          </div>
        );
      })}
    </AppContainer>
  );
};

export default Service;

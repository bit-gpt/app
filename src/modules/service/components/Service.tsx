import clsx from "clsx";
import { useMemo, useState } from "react";
import AppContainer from "shared/components/AppContainer";
import SearchFilter from "./SearchFilter";
import { useParams } from "react-router-dom";
import useApps from "shared/hooks/useApps";
import useServices from "shared/hooks/useServices";
import ServicesCard from "./ServiceCard";
import { getServiceStatus } from "shared/helpers/utils";

const Service = () => {
  const { appId } = useParams();
  const { data: response, isLoading: isServicesLoading } = useServices();
  const { data: appResponse } = useApps();
  const [filter, setFilter] = useState(new Map<string, boolean>());
  const services = response?.data || [];
  const apps = appResponse?.data || [];

  const filteredServices = useMemo(() => {
    if (filter.size === 0) return services;

    if (![...filter.values()].includes(true)) return services;

    return services.filter((service) => {
      const filterdApps = apps.filter((app) => service.apps.includes(app.id));
      return filterdApps.reduce((acc, app) => {
        return acc || (filter.get(app.id) as boolean);
      }, false);
    });
  }, [services, filter]);

  return (
    <AppContainer>
      <div className="mask-heading text-center mb-[29px]">
        <h2 className="!mt-5">Select a Service Type</h2>
      </div>

      {apps.length > 0 && (
        <SearchFilter
          onFilterChange={setFilter}
          appId={appId as string}
          apps={apps}
        />
      )}

      <div className="flex gap-[22px] flex-wrap justify-center mt-16">
        {filteredServices.map((service) => (
          <ServicesCard
            key={service.id}
            icon={service.icon}
            className={clsx("dashboard-bottom__card flex-wrap !pr-5", {
              "services-running": service.running,
            })}
            title={service.name}
            status={getServiceStatus(service)}
            serviceId={service.id}
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

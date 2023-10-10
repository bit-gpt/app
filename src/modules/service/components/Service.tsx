import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AppContainer from "shared/components/AppContainer";
import { isDeveloperMode, isServiceBinary } from "shared/helpers/utils";
import useInterfaces from "shared/hooks/useInterfaces";

import useDownloadServiceStream from "../../../shared/hooks/useDownloadServiceStream";
import useGetServices from "../../../shared/hooks/useGetServices";
import useSettingStore from "../../../shared/store/setting";
import type { Service as IService } from "../types";

import CustomServiceCard from "./CustomServiceCard";
import SearchFilter from "./SearchFilter";
import ServiceCard from "./ServiceCard";

// TODO: appId is not a url param anymore
const Service = () => {
  const { appId } = useParams();

  const {
    data: services,
    isLoading: isServicesLoading,
    refetch: refetchServices,
  } = useGetServices();
  const { data: apps } = useInterfaces();
  const progresses = useSettingStore((state) => state.serviceDownloadsInProgress);
  const { mutate: download } = useDownloadServiceStream();

  const [filter, setFilter] = useState(new Map<string, boolean>());

  const filteredApps = useMemo(() => {
    if (filter.size === 0) return apps;
    if (![...filter.values()].includes(true)) return apps;
    return apps?.filter((app) => filter.get(app.id) as boolean);
  }, [apps, filter]);

  const isDevMode = isDeveloperMode();

  // Continue service download if in progress
  useEffect(() => {
    (async () => {
      for (const serviceId in progresses) {
        const service = services?.filter((s) => s.id === serviceId)[0];
        if (service) {
          download({
            serviceId,
            huggingFaceId: isServiceBinary(service) ? service.huggingFaceId : undefined,
            modelFiles: isServiceBinary(service) ? service.modelFiles : undefined,
            serviceType: service.serviceType ?? "",
            afterSuccess: async () => {
              useSettingStore.getState().removeServiceDownloadInProgress(serviceId);
              await refetchServices();
            },
          });
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(progresses).length]);

  const ServicesComponents = useMemo(() => {
    return filteredApps?.map((app) => {
      const filteredServices =
        services?.filter((service) => service?.interfaces?.includes(app.id)) ?? [];
      return (
        <div key={app.id} className="mt-10">
          <h3 className="text-grey-300 font-bold text-sm md:text-xl flex md:mb-5 mb-[13px]">
            {app.name}
          </h3>
          <div className="flex gap-[22px] flex-wrap ">
            {filteredServices.map((service, index) => (
              <ServiceCard
                key={`${service.id}_${index}`}
                icon={service.icon}
                className={clsx("service-card flex-wrap", {
                  "services-running": service.running,
                })}
                service={service}
              />
            ))}

            {!isServicesLoading && filteredServices.length === 0 && (
              <div className="text-white opacity-70">No services found</div>
            )}
            {isServicesLoading && <div className="text-center text-[#8C8C8C]">Loading...</div>}
            {isDevMode && <CustomServiceCard />}
          </div>
        </div>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filteredApps?.length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(progresses),
    isDevMode,
    isServicesLoading,
  ]);

  return (
    <AppContainer>
      <div className="mask-heading mb-5 md:-mx-6 xl:-mx-10">
        <h2 className="md:!mt-10 max-md:!mt-4">Dashboard</h2>
      </div>
      {apps && apps.length > 0 && (
        <SearchFilter onFilterChange={setFilter} appId={appId as string} apps={apps} />
      )}
      {ServicesComponents}
    </AppContainer>
  );
};

export default Service;

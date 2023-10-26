import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AppContainer from "shared/components/AppContainer";
import {
  checkIfAccessible,
  getServiceStatus,
  isDeveloperMode,
  isServiceBinary,
} from "shared/helpers/utils";
import useInterfaces from "shared/hooks/useInterfaces";

import useDownloadServiceStream from "../../../shared/hooks/useDownloadServiceStream";
import useGetServices from "../../../shared/hooks/useGetServices";
import useSettingStore from "../../../shared/store/setting";

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
  const downloadingServices = useSettingStore.getState().downloadingServices;
  const [filter, setFilter] = useState(new Map<string, boolean>());

  const filteredApps = useMemo(() => {
    if (filter.size === 0) return apps;
    if (![...filter.values()].includes(true)) return apps;
    return apps?.filter((app) => filter.get(app.id) as boolean);
  }, [apps, filter]);

  // Resume service download if in progress
  useEffect(() => {
    (async () => {
      if (!isServicesLoading) {
        for (const serviceId in progresses) {
          const service = services?.filter((s) => s.id === serviceId)[0];
          const isDownloading = downloadingServices.includes(serviceId);
          if (service && !isDownloading && Object.keys(service ?? {}).length) {
            console.log(`Resume download for ${serviceId}`);
            download({
              serviceId,
              binariesUrl: isServiceBinary(service) ? service.binariesUrl : undefined,
              weightsDirectoryUrl: isServiceBinary(service)
                ? service.weightsDirectoryUrl
                : undefined,
              weightsFiles: isServiceBinary(service) ? service.weightsFiles : undefined,
              serviceType: service.serviceType ?? "",
              afterSuccess: async () => {
                useSettingStore.getState().removeServiceDownloadInProgress(serviceId);
                await refetchServices();
              },
            });
          }
        }
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [Object.keys(progresses).length, isServicesLoading, downloadingServices.length]);

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
            {filteredServices
              .sort((a, b) => (checkIfAccessible(getServiceStatus(a)) ? -1 : 1))
              .map((service, index) => (
                <ServiceCard
                  key={`${service.id}_${index}`}
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
            {isDeveloperMode() && <CustomServiceCard />}
          </div>
        </div>
      );
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    filteredApps?.length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(progresses),
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

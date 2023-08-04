import clsx from "clsx";
import { useEffect, useMemo, useState } from "react";
import { useParams } from "react-router-dom";
import AppContainer from "shared/components/AppContainer";
import { isDeveloperMode } from "shared/helpers/utils";
import useInterfaces from "shared/hooks/useInterfaces";
import useServices from "shared/hooks/useServices";

import useDownloadServiceStream from "../../../shared/hooks/useDownloadServiceStream";
import useSettingStore from "../../../shared/store/setting";

import CustomServiceCard from "./CustomServiceCard";
import SearchFilter from "./SearchFilter";
import ServiceCard from "./ServiceCard";

const Service = () => {
  const { appId } = useParams();

  const { data: response, isLoading: isServicesLoading, refetch: refetchServices } = useServices();
  const { data: appResponse } = useInterfaces();
  const serviceDownloadsInProgress = useSettingStore((state) => state.serviceDownloadsInProgress);
  const removeServiceDownloadInProgress = useSettingStore(
    (state) => state.removeServiceDownloadInProgress,
  );
  const { download, progresses } = useDownloadServiceStream();

  const [filter, setFilter] = useState(new Map<string, boolean>());

  const apps = useMemo(() => appResponse?.data || [], [appResponse?.data]);

  const filteredApps = useMemo(() => {
    if (filter.size === 0) return apps;
    if (![...filter.values()].includes(true)) return apps;
    return apps.filter((app) => filter.get(app.id) as boolean);
  }, [apps, filter]);

  const isDevMode = isDeveloperMode();

  // Continue service download if in progress
  useEffect(() => {
    (async () => {
      for (const serviceId in serviceDownloadsInProgress) {
        await download(serviceId, async () => {
          removeServiceDownloadInProgress(serviceId);
          await refetchServices();
        });
      }
    })();
  }, [
    download,
    refetchServices,
    removeServiceDownloadInProgress,
    serviceDownloadsInProgress,
    serviceDownloadsInProgress.length,
  ]);

  const ServicesComponents = useMemo(() => {
    const services = response?.data || [];
    return filteredApps.map((app) => {
      const filteredServices = services.filter((service) => service.interfaces.includes(app.id));
      return (
        <div key={app.id} className="mt-10">
          <h3 className="text-brightgray font-bold md:text-xl maxMd:text-sm text-base flex md:mb-5 mb-[13px]">
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
    filteredApps.length,
    // eslint-disable-next-line react-hooks/exhaustive-deps
    JSON.stringify(progresses),
    isDevMode,
    isServicesLoading,
    response?.data,
  ]);

  return (
    <AppContainer>
      <div className="mask-heading mb-5 md:-mx-6 xl:-mx-10">
        <h2 className="md:!mt-10 maxMd:!mt-4">Dashboard</h2>
      </div>
      {apps.length > 0 && (
        <SearchFilter onFilterChange={setFilter} appId={appId as string} apps={apps} />
      )}
      {ServicesComponents}
    </AppContainer>
  );
};

export default Service;

import { useQueryClient } from "@tanstack/react-query";
import arrow from "assets/images/arrow.svg";
import ServiceActions from "modules/service/components/ServiceActions";
import { useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import AppContainer from "shared/components/AppContainer";
import { getServiceStatus } from "shared/helpers/utils";
import useGetService from "shared/hooks/useGetService";
import { SERVICES_KEY } from "shared/hooks/useGetServices";
import useInterfaces from "shared/hooks/useInterfaces";
import UseScrollToTop from "shared/hooks/useScrollToTop";

import type { Service } from "../../service/types";

import ServiceDescription from "./ServiceDescription";
import ServiceDocumentation from "./ServiceDocumentation";
import ServiceGeneralInfo from "./ServiceGeneralInfo";
import ServiceHeader from "./ServiceHeader";
import ServiceLoading from "./ServiceLoading";
import ServiceResourceBars from "./ServiceResourceBars";

const ServiceDetail = () => {
  const queryClient = useQueryClient();
  const { serviceId, serviceType } = useParams<{
    serviceId: string;
    serviceType: Service["serviceType"];
  }>();
  const navigate = useNavigate();
  const { data: service, isLoading, refetch } = useGetService(serviceId!, serviceType!);

  const { data: interfaces } = useInterfaces();

  const refetchServices = useCallback(() => {
    refetch();
    queryClient.refetchQueries({ queryKey: [SERVICES_KEY] });
  }, [queryClient, refetch]);

  const back = () => {
    navigate("/");
  };

  if (isLoading || !service || Object.keys(service ?? {}).length === 0) return <ServiceLoading />;

  const status = getServiceStatus(service);

  return (
    <AppContainer>
      <UseScrollToTop />
      <button
        className="w-[30px] h-[30px] mt-10 md:mb-14 mb-3 xl:-mx-14 lg:-mx-8 md:-mx-6"
        onClick={back}
      >
        <img className="md:mx-auto" src={arrow} alt="arrow-logo" />
      </button>
      <div className="flex flex-wrap items-start md:mb-[62px] mb-[22px] max-md:justify-between services-header max-sm:gap-4 md:justify-between md:gap-4">
        <div className="services-detail--header">
          <ServiceHeader
            title={service.name}
            tags={service.interfaces}
            icon={service.icon}
            subtitle={service.id}
            isInBeta={service.beta}
          />
        </div>
        <div className="services-detail-header">
          <ServiceActions
            service={service}
            status={status}
            refetch={refetchServices}
            isDetailView={true}
            interfaces={interfaces?.filter((app) => service.interfaces?.includes(app.id)) ?? []}
            needsUpdate={service.needsUpdate}
            memoryRequirements={service.modelInfo?.memoryRequirements}
          />
        </div>
      </div>
      <div className="service-detail">
        <ServiceDocumentation description={service.documentation} />
        <div className="lg:w-[40%] w-full">
          <ServiceResourceBars
            serviceId={service.id}
            serviceType={service.serviceType}
            status={status}
          />
          <ServiceGeneralInfo service={service} />
          <ServiceDescription description={service.description} />
        </div>
      </div>
    </AppContainer>
  );
};

export default ServiceDetail;

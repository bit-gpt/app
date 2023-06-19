import AppContainer from "shared/components/AppContainer";
import ServiceDocumentation from "./ServiceDocumentation";
import useService from "shared/hooks/useService";
import { useNavigate, useParams } from "react-router-dom";
import ServiceHeader from "./ServiceHeader";
import ServiceResourceBars from "./ServiceResourceBars";
import ServiceGeneralInfo from "./ServiceGeneralInfo";
import ServiceDescription from "./ServiceDescription";
import ServiceLoading from "./ServiceLoading";
import { Service } from "modules/service/types";
import { getServiceStatus } from "shared/helpers/utils";
import ServiceActions from "modules/service/components/ServiceActions";
import { useQueryClient } from "@tanstack/react-query";
import { SERVICES_KEY } from "shared/hooks/useServices";
import { useCallback } from "react";
import useInterfaces from "shared/hooks/useInterfaces";
import arrow from "assets/images/arrow.svg";
import UseScrollToTop from "shared/hooks/useScrollToTop";

const ServiceDetail = () => {
  const queryClient = useQueryClient();
  const { serviceId } = useParams();
  const navigate = useNavigate();
  const { data: response, isLoading, refetch } = useService(serviceId!);
  const service = response?.data || ({} as Service);

  const { data: appResponse } = useInterfaces();
  const interfaces = appResponse?.data || [];

  const refetchServices = useCallback(() => {
    refetch();
    queryClient.refetchQueries([SERVICES_KEY]);
  }, [refetch]);

  const back = () => {
    navigate("/");
  };

  const status = getServiceStatus(service);

  if (isLoading) return <ServiceLoading />;

  return (
    <AppContainer>
      <UseScrollToTop />
      <button
        className="w-[30px] h-[30px] mt-10 md:mb-14 mb-3 xl:-mx-14 lg:-mx-8 md:-mx-6"
        onClick={back}
      >
        <img className="mx-auto" src={arrow} alt="arrow-logo" />
      </button>
      <div className="flex flex-wrap items-start md:mb-[62px] mb-[22px] max-md:justify-between services-header max-sm:gap-4 md:justify-between md:gap-4">
        <div className="services-detail--header">
          <ServiceHeader
            title={service.name}
            tags={service.interfaces}
            icon={service.icon}
            subtitle={service.id}
          />
        </div>
        <div className="services-detail-header">
          <ServiceActions
            serviceId={serviceId!}
            status={status}
            refetch={refetchServices}
            isDetailView={true}
            interfaces={interfaces.filter((app) => service.interfaces?.includes(app.id))}
            needsUpdate={service.needsUpdate}
            memoryRequirements={service.modelInfo?.memoryRequirements}
          />
        </div>
      </div>
      <div className="service-detail">
        <ServiceDocumentation description={service.documentation} />
        <div className="lg:w-[40%]">
          <ServiceResourceBars serviceId={service.id} status={status} />
          <ServiceGeneralInfo service={service} />
          <ServiceDescription description={service.description} />
        </div>
      </div>
    </AppContainer>
  );
};

export default ServiceDetail;

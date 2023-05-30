import AppContainer from "shared/components/AppContainer";
import ServiceDocumentation from "./ServiceDocumentation";
import useService from "shared/hooks/useService";
import { useParams } from "react-router-dom";
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
import useApps from "shared/hooks/useInterfaces";

const ServiceDetail = () => {
  const queryClient = useQueryClient();
  const { serviceId } = useParams();
  const { data: response, isLoading, refetch } = useService(serviceId!);
  const service = response?.data || ({} as Service);
  
  const {data: appResponse} = useApps();
  const interfaces = appResponse?.data || [];

  const refetchServices = useCallback(() => {
    refetch();
    queryClient.refetchQueries([SERVICES_KEY]);
  }, [refetch]);

  const status = getServiceStatus(service);

  if (isLoading) return <ServiceLoading />;
  return (
    <AppContainer>
      <div className="flex flex-wrap items-start mb-[62px] mt-5">
        <ServiceHeader
          title={service.name}
          tags={service.interfaces}
          icon={service.icon}
          subtitle={service.id}
        />
        <ServiceActions
          serviceId={serviceId!}
          status={status}
          refetch={refetchServices}
          isDetailView={true}
          interfaces={interfaces.filter((app) =>  service.interfaces?.includes(app.id))}
        />
      </div>
      <div className="service-detail">
        <ServiceDocumentation description={service.documentation} />
        <div className="w-full">
          <ServiceResourceBars serviceId={service.id} />
          <ServiceGeneralInfo service={service} />
          <ServiceDescription description={service.description} />
        </div>
      </div>
    </AppContainer>
  );
};

export default ServiceDetail;

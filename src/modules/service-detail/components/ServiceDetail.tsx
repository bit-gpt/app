import AppContainer from "shared/components/AppContainer";
import ServiceDocumentation from "./ServiceDocumentation";
import useService from "shared/hooks/useService";
import { useParams } from "react-router-dom";
import ServiceHeader from "./ServiceHeader";
import ServiceControls from "./ServiceControls";
import ServiceResourceBars from "./ServiceResourceBars";
import ServiceGeneralInfo from "./ServiceGeneralInfo";
import ServiceDescription from "./ServiceDescription";
import ServiceLoading from "./ServiceLoading";
import { Service } from "modules/service/types";
import { BACKEND_URL } from "shared/helpers/utils";

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const { data: response, isLoading } = useService(serviceId!);
  const service = response?.data || {} as Service;

  console.log({service})

  if (isLoading) return <ServiceLoading />;

  return (
    <AppContainer>
      <div className="flex flex-wrap items-start mb-[62px] mt-5">
        <ServiceHeader title={service.name} tags={service.apps} icon={`${BACKEND_URL}${service.icon}`} subtitle={service.id} />
        <ServiceControls />
      </div>
      <div className="service-detail">
        <ServiceDocumentation />
        <div className="w-full">
          <ServiceResourceBars />
          <ServiceGeneralInfo />
          <ServiceDescription />
        </div>
      </div>
    </AppContainer>
  );
};

export default ServiceDetail;

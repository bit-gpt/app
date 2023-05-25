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

const ServiceDetail = () => {
  const { serviceId } = useParams();
  const { data: response, isLoading, refetch } = useService(serviceId!);
  const service = response?.data || ({} as Service);

  if (isLoading) return <ServiceLoading />;

  const status = getServiceStatus(service);

  return (
    <AppContainer>
      <div className="flex flex-wrap items-start mb-[62px] mt-5">
        <ServiceHeader
          title={service.name}
          tags={service.apps}
          icon={service.icon}
          subtitle={service.id}
        />
        <ServiceActions
          serviceId={serviceId!}
          status={status}
          refetch={refetch}
        >
          {status === "running" && (
            <button className="bg-brightgray rounded-3xl px-6 py-[10px] text-sm">
              Play &nbsp; &#8594;
            </button>
          )}
        </ServiceActions>
      </div>
      <div className="service-detail">
        <ServiceDocumentation description={service.documentation} />
        <div className="w-full">
          <ServiceResourceBars />
          <ServiceGeneralInfo service={service} />
          <ServiceDescription description={service.description} />
        </div>
      </div>
    </AppContainer>
  );
};

export default ServiceDetail;

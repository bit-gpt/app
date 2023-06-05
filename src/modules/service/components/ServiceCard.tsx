import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { SERVICES_KEY } from "shared/hooks/useServices";
import { useCallback } from "react";
import { ServiceCardProps } from "../types";
import ServiceActions from "./ServiceActions";
import { SERVICE_KEY } from "shared/hooks/useService";
import { getServiceStatus } from "shared/helpers/utils";
import useInterfaces from "shared/hooks/useInterfaces";

const ServiceCard = ({ className, icon, service }: ServiceCardProps) => {
  const queryClient = useQueryClient();

  const serviceId = service.id;
  const status = getServiceStatus(service);
  const title = service.name;
  const { data: response } = useInterfaces();
  const interfaces = response?.data || [];

  const refetch = useCallback(() => {
    queryClient.refetchQueries([SERVICES_KEY]);
    queryClient.invalidateQueries([SERVICE_KEY, serviceId]);
  }, []);

  return (
    <Link className={className} to={`/services/${serviceId}/detail`}>
      <div className="flex gap-8 items-start flex-wrap w-full relative">
        <div className="dashboard-bottom__card-box">
          <img src={icon} alt={title} />
        </div>
        <ServiceActions
          refetch={refetch}
          serviceId={serviceId}
          status={status}
          interfaces={interfaces.filter((app) =>
            service.interfaces?.includes(app.id)
          )}
        />
      </div>
      <h3>{title}</h3>
    </Link>
  );
};

export default ServiceCard;

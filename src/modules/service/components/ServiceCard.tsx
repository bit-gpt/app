import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { getServiceStatus } from "shared/helpers/utils";
import useInterfaces from "shared/hooks/useInterfaces";
import { SERVICE_KEY } from "shared/hooks/useService";
import { SERVICES_KEY } from "shared/hooks/useServices";

import type { ServiceCardProps } from "../types";

import Beta from "./Beta";
import Petals from "./Petals";
import ServiceActions from "./ServiceActions";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isGreyCard = ["not_supported", "not_enough_system_memory", "coming_soon"].includes(status);
  const redirectLink = status === "coming_soon" ? "/" : `/services/${serviceId}/detail`;

  return (
    <Link className={clsx(className, isGreyCard && "disabled--card")} to={redirectLink}>
      <div className="flex items-start flex-wrap w-full relative justify-between">
        <div className="service-card__logo">
          <img src={icon} alt={title} />
        </div>
        <ServiceActions
          refetch={refetch}
          serviceId={serviceId}
          status={status}
          interfaces={interfaces.filter((app) => service.interfaces?.includes(app.id))}
          needsUpdate={service.needsUpdate}
          memoryRequirements={service.modelInfo?.memoryRequirements}
        />
      </div>
      <h3>
        {title}
        {service.beta && <Beta className="md:-top-2 top-[-5px]" />}
        {service.petals && <Petals className="md:-top-2 top-[-5px]" />}
      </h3>
    </Link>
  );
};

export default ServiceCard;

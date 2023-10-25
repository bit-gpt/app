import { useQueryClient } from "@tanstack/react-query";
import clsx from "clsx";
import { useCallback } from "react";
import { Link } from "react-router-dom";
import { checkIfAccessible, getServiceStatus } from "shared/helpers/utils";
import { SERVICE_KEY } from "shared/hooks/useGetService";
import { SERVICES_KEY } from "shared/hooks/useGetServices";
import useInterfaces from "shared/hooks/useInterfaces";

import useWarningModal from "../hooks/useWarningModal";
import type { ServiceCardProps } from "../types";

import Beta from "./Beta";
import ServiceActions from "./ServiceActions";

const ServiceCard = ({ className, icon, service }: ServiceCardProps) => {
  const queryClient = useQueryClient();

  const serviceId = service.id;
  const status = getServiceStatus(service);
  const title = service.name;
  const { data: interfaces } = useInterfaces();
  const { openWarningModal, closeWarningModal, isWarningModalOpen } = useWarningModal();

  const refetch = useCallback(() => {
    queryClient.refetchQueries([SERVICES_KEY]);
    queryClient.invalidateQueries([SERVICE_KEY, serviceId]);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const isAccessible = checkIfAccessible(status);
  const redirectLink =
    status === "coming_soon"
      ? "/"
      : `/services/${serviceId}/${service.serviceType ?? "docker"}/detail`;

  return (
    <Link
      className={clsx(className, { "disabled--card": !isAccessible })}
      onClick={(e) => !isAccessible && openWarningModal(e)}
      to={redirectLink}
    >
      <div className="flex items-start flex-wrap w-full relative justify-between">
        <div className="service-card__logo">
          <img src={icon} alt={title} />
        </div>
        <ServiceActions
          refetch={refetch}
          service={service}
          status={status}
          interfaces={interfaces?.filter((app) => service.interfaces?.includes(app.id)) ?? []}
          needsUpdate={service.needsUpdate}
          memoryRequirements={service.modelInfo?.memoryRequirements}
          closeWarningModal={closeWarningModal}
          isWarningModalOpen={isWarningModalOpen}
        />
      </div>
      <h3>
        {title}
        {service.beta && <Beta className="md:-top-2 top-[-5px]" />}
      </h3>
    </Link>
  );
};

export default ServiceCard;

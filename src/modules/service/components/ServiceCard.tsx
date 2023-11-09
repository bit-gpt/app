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
import Docker from "./Docker";
import Local from "./Local";
import PeerToPeer from "./PeerToPeer";
import PremNetwork from "./PremNetwork";
import ServiceActions from "./ServiceActions";

const ServiceCard = ({ className, service }: ServiceCardProps) => {
  const queryClient = useQueryClient();

  const serviceId = service.id;
  const status = getServiceStatus(service);
  const title = service.name;
  const { data: interfaces } = useInterfaces();
  const { openWarningModal, closeWarningModal, isWarningModalOpen } = useWarningModal();

  const refetch = useCallback(() => {
    queryClient.refetchQueries({ queryKey: [SERVICES_KEY] });
    queryClient.invalidateQueries({ queryKey: [SERVICE_KEY, serviceId] });
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
          <img src={service.icon} alt={title} />
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
      <div>
        <h3>
          {title}
          {service.beta && <Beta className="md:-top-2 top-[-5px]" />}
        </h3>
        {service.petals ? (
          <p>
            <PeerToPeer className="md:top-1 right-1" />
            <PremNetwork className="md:top-1 left-1" />
          </p>
        ) : (
          <p>
            <Local className="md:top-1 right-1" />
            {status === "docker_only" && <Docker className="md:top-1 left-1" />}
          </p>
        )}
      </div>
    </Link>
  );
};

export default ServiceCard;

import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { SERVICES_KEY } from "shared/hooks/useServices";
import { useCallback } from "react";
import { ServiceCardProps } from "../types";
import ServiceActions from "./ServiceActions";

const ServiceCard = ({
  title,
  className,
  icon,
  status,
  serviceId,
}: ServiceCardProps) => {
  const queryClient = useQueryClient();

  const refetch = useCallback(() => {
    queryClient.refetchQueries([SERVICES_KEY]);
  }, []);

  return (
    <Link to={`/services/${serviceId}/detail`} className={className}>
      <div className="flex gap-8 items-start flex-wrap w-full relative">
        <div className="dashboard-bottom__card-box">
          <img
            src={icon}
            alt={title}
            className="rounded-[11px] w-[28px] h-[28px]"
          />
        </div>
        <ServiceActions
          refetch={refetch}
          serviceId={serviceId}
          status={status}
        />
      </div>
      <h3>{title}</h3>
    </Link>
  );
};

export default ServiceCard;

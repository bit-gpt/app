import clsx from "clsx";
import WarningIcon from "shared/components/WarningIcon";
import useServiceStats from "shared/hooks/useServiceStats";

import type { ServiceResourceBarsProps } from "../types";

const ServiceResourceBars = ({ serviceId, status, serviceType }: ServiceResourceBarsProps) => {
  const { data } = useServiceStats(serviceId, serviceType);

  return (
    <div className="right-top-card card py-8 px-4">
      <ul
        className={clsx(
          "grid lg:grid-cols-3 items-end gap-4 !ml-0",
          status !== "running" && "status-not-running",
        )}
      >
        <li>
          <p>Memory</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0 whitespace-nowrap">
              {data?.memory_percentage === undefined && <span className="lg:hidden">-</span>}
              {data?.memory_usage} GiB
            </p>
            <div className="progress">
              <div
                className="progress-container"
                style={{ width: `${data?.memory_percentage}%` }}
              ></div>
            </div>
          </div>
        </li>
        <li>
          <p>CPU</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0 whitespace-nowrap">
              {data?.cpu_percentage === undefined && <span className="lg:hidden">-</span>}
              {data?.cpu_percentage}%
            </p>
            <div className="progress">
              <div
                className="progress-container"
                style={{ width: `${data?.cpu_percentage}%` }}
              ></div>
            </div>
          </div>
        </li>
        <li>
          <p>Image Size</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0 whitespace-nowrap">
              {data?.storage_percentage === undefined && <span className="lg:hidden">-</span>}
              {data?.storage_usage} GiB
            </p>
            <div className="progress">
              <div
                className="progress-container"
                style={{ width: `${data?.storage_percentage}%` }}
              ></div>
            </div>
          </div>
        </li>
      </ul>
      {status !== "running" && (
        <p className="flex items-center pb-3 md:mx-4 max-md:mt-4 gap-[7px] !text-[12px] service-is__not-running">
          <WarningIcon />
          The service is not Running. Resources not available
        </p>
      )}
    </div>
  );
};

export default ServiceResourceBars;

import useServiceStats from "shared/hooks/useServiceStats";
import { ServiceResourceBarsProps } from "../types";
import WarningIcon from "shared/components/WarningIcon";
import clsx from "clsx";

const ServiceResourceBars = ({ serviceId, status }: ServiceResourceBarsProps) => {
  const { data: response } = useServiceStats(serviceId);

  return (
    <div className="right-top-card card">
      <ul
        className={clsx(
          "grid lg:grid-cols-3 items-end gap-4 !ml-0 p-5",
          status !== "running" && "status-not-running"
        )}
      >
        <li>
          <p>Memory</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0 whitespace-nowrap">{response?.data?.memory_usage} GiB</p>
            <div className="progress">
              <div
                className="progress-container"
                style={{ width: `${response?.data?.memory_percentage}%` }}
              ></div>
            </div>
          </div>
        </li>
        <li>
          <p>CPU</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0 whitespace-nowrap">{response?.data?.cpu_percentage}%</p>
            <div className="progress">
              <div
                className="progress-container"
                style={{ width: `${response?.data?.cpu_percentage}%` }}
              ></div>
            </div>
          </div>
        </li>
        <li>
          <p>Image Size</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0 whitespace-nowrap">{response?.data?.storage_usage} GiB</p>
            <div className="progress">
              <div
                className="progress-container"
                style={{ width: `${response?.data?.storage_percentage}%` }}
              ></div>
            </div>
          </div>
        </li>
      </ul>
      {status !== "running" && (
        <p className="flex items-center pb-3 mx-4 gap-[7px] !text-[12px] service-is__not-running">
          <WarningIcon />
          The service is not Running. Resources not available
        </p>
      )}
    </div>
  );
};

export default ServiceResourceBars;

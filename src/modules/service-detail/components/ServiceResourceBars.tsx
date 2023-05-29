import useServiceStats from "shared/hooks/useServiceStats";
import { ServiceResourceBarsProps } from "../types";

const ServiceResourceBars = ({ serviceId }: ServiceResourceBarsProps) => {
  const { data: response } = useServiceStats(serviceId);

  return (
    <ul className="grid xl:grid-cols-3 items-end gap-4 right-top-card card !ml-0 p-5">
      <li>
        <p>Memory</p>
        <div className="flex gap-[6px] items-center">
          <p className="!mb-0">{response?.data?.memory_usage} GiB</p>
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
          <p className="!mb-0">{response?.data?.cpu_percentage}%</p>
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
          <p className="!mb-0">{response?.data?.storage_usage} GiB</p>
          <div className="progress">
            <div className="progress-container" style={{ width: `${response?.data?.storage_percentage}%` }}></div>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default ServiceResourceBars;

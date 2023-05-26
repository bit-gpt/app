import useServiceStats from "shared/hooks/useServiceStats";
import { ServiceResourceBarsProps } from "../types";

const ServiceResourceBars = ({ serviceId }: ServiceResourceBarsProps) => {
  const { data: response } = useServiceStats(serviceId);

  const memory = response?.data?.memory_percentage || 0;
  const memoryPercent = memory * 100;

  const cpu = response?.data?.cpu_percentage || 0;
  const cpuPercentage = cpu * 100;

  return (
    <ul className="grid xl:grid-cols-3 items-end gap-4 right-top-card card !ml-0 p-5">
      <li>
        <p>Used Memory/Memory Limit</p>
        <div className="flex gap-[6px] items-center">
          <p className="!mb-0">{memoryPercent}%</p>
          <div className="progress">
            <div
              className="progress-container"
              style={{ width: `${memoryPercent}%` }}
            ></div>
          </div>
        </div>
      </li>
      <li>
        <p>Used CPU</p>
        <div className="flex gap-[6px] items-center">
          <p className="!mb-0">{cpuPercentage}%</p>
          <div className="progress">
            <div
              className="progress-container"
              style={{ width: `${cpuPercentage}%` }}
            ></div>
          </div>
        </div>
      </li>
      <li>
        <p>Network IO</p>
        <div className="flex gap-[6px] items-center">
          <p className="!mb-0">30%</p>
          <div className="progress">
            <div className="progress-container" style={{ width: "30%" }}></div>
          </div>
        </div>
      </li>
    </ul>
  );
};

export default ServiceResourceBars;

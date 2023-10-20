import cpu from "assets/images/cpu.svg";
import memory from "assets/images/memory.svg";
import storage from "assets/images/storage.svg";
import useSystemStats from "shared/hooks/useSystemStats";

const SystemResources = () => {
  const { data } = useSystemStats();
  return (
    <div className="settings-card">
      <h2 className="text-white mb-4 text-lg">Resources</h2>
      <ul className="flex items-end max-lg:flex-wrap gap-6">
        <li>
          <div className="flex flex-wrap justify-between">
            <span className="flex items-center">
              <img src={memory} alt="memory" className="w-4 h-4" />
              Memory&nbsp;
            </span>
            <span>
              {data?.memory_usage} / {data?.memory_limit} GiB
            </span>
          </div>
          <div className="progress">
            <div
              className="progress-container"
              style={{ width: `${data?.memory_percentage}%` }}
            ></div>
          </div>
        </li>
        <li>
          <div className="flex flex-wrap justify-between">
            <span className="flex items-center">
              <img src={cpu} alt="cpu" className="w-4 h-4" />
              CPU&nbsp;
            </span>
            <span>{data?.cpu_percentage}%</span>
          </div>
          <div className="progress">
            <div className="progress-container" style={{ width: `${data?.cpu_percentage}%` }}></div>
          </div>
        </li>
        <li>
          <div className="flex flex-wrap justify-between">
            <span className="flex items-center">
              <img src={storage} alt="storage" className="w-4 h-4" />
              Storage&nbsp;
            </span>
            <span>
              {data?.storage_usage} / {data?.storage_limit} GiB
            </span>
          </div>
          <div className="progress">
            <div
              className="progress-container"
              style={{ width: `${data?.storage_percentage}%` }}
            ></div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default SystemResources;

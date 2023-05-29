import useSystemStats from "shared/hooks/useSystemStats";

const CPUResources = () => {
  const { data: response } = useSystemStats();
  return (
    <div className="settings-card">
      <h3>Resources</h3>
      <div className="settings-card__border" />
      <ul className="flex items-end max-lg:flex-wrap gap-6">
        <li>
          <div className="flex flex-wrap justify-between">
            <span className="flex items-center">
              Memory&nbsp;
            </span>
            <span>{response?.data?.memory_usage} / {response?.data?.memory_limit} GiB</span>
          </div>
          <div className="progress">
            <div className="progress-container" style={{ width: `${response?.data?.memory_percentage}%` }}></div>
          </div>
        </li>
        <li>
          <div className="flex flex-wrap justify-between">
            <span className="flex items-center">
              CPU&nbsp;
            </span>
            <span>{response?.data?.cpu_percentage}%</span>
          </div>
          <div className="progress">
            <div className="progress-container" style={{ width: `${response?.data?.cpu_percentage}%` }}></div>
          </div>
        </li>
        <li>
          <div className="flex flex-wrap justify-between">
            <span className="flex items-center">
              Storage&nbsp;
            </span>
            <span>{response?.data?.storage_usage} / {response?.data?.storage_limit} GiB</span>
          </div>
          <div className="progress">
            <div className="progress-container" style={{ width: `${response?.data?.storage_percentage}%` }}></div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default CPUResources;

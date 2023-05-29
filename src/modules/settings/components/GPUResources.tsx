import useGPUStats from "shared/hooks/useGPUStats";

const GPUResources = () => {
  const { data: response } = useGPUStats();
  return (
    <div> 
      <h2>GPUs</h2>
      <div className="settings-card">
        {response?.data?.gpu_name ? (
          <>
            <h3>{response.data.gpu_name}</h3>
            <div className="settings-card__border" />
            <ul className="flex items-end max-lg:flex-wrap gap-6">
              <li>
                <div className="flex flex-wrap justify-between">
                  <span className="flex items-center">
                    Memory&nbsp;
                  </span>
                  <span>{response.data.used_memory} / {response.data.total_memory} GiB</span>
                </div>
                <div className="progress">
                  <div className="progress-container" style={{ width: `${response.data.memory_percentage}%` }}></div>
                </div>
              </li>
            </ul>
          </>
        ) : (
          <div>No GPUs available</div>
        )}
      </div>
    </div>
  );
};

export default GPUResources;

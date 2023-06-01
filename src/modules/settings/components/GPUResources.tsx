import useGPUStats from "shared/hooks/useGPUStats";
import nvidia_logo from "assets/images/nvidia_logo.svg";

const GPUResources = () => {
  const { data: response } = useGPUStats();
  return (
    <div className="mt-[68px]">
      <h2 className="text-brightgray mb-[37px] text-lg">GPUs</h2>
      <div className="settings-card">
        {response?.data?.gpu_name ? (
          <>
            <h3>{response.data.gpu_name}</h3>
            <ul className="flex items-end max-lg:flex-wrap gap-6">
              <li>
                <div className="flex flex-wrap justify-between">
                  <span className="flex items-center">Memory&nbsp;</span>
                  <span>
                    {response.data.used_memory} / {response.data.total_memory}{" "}
                    GiB
                  </span>
                </div>
                <div className="progress">
                  <div
                    className="progress-container"
                    style={{ width: `${response.data.memory_percentage}%` }}
                  ></div>
                </div>
              </li>
            </ul>
          </>
        ) : (
          <div className="grid grid-cols-3">
            {response?.data?.gpu_name ? (
              <div className="shadow-default">
                <div className="gpu-resources__header">
                  <img src={nvidia_logo} alt="nvidia-logo" />
                </div>
                <div className="py-8 px-9 gpu-resources__body">
                  <h3 className="text-brightgray mb-4 text-lg">
                    {response.data.gpu_name}
                  </h3>
                  <ul className="!p-0">
                    <li>
                      <div className="flex flex-wrap justify-between">
                        <span className="flex items-center">Memory&nbsp;</span>
                        <span>
                          {response.data.used_memory} /{" "}
                          {response.data.total_memory} GiB
                        </span>
                      </div>
                      <div className="progress">
                        <div
                          className="progress-container"
                          style={{
                            width: `${response.data.memory_percentage}%`,
                          }}
                        ></div>
                      </div>
                    </li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-white opacity-70">No GPUs available</p>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default GPUResources;

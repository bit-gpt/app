import useGPUStats from "shared/hooks/useGPUStats";
import nvidia_logo from "assets/images/nvidia_logo.svg";

const GPUResources = () => {
  const { data: response } = useGPUStats();
  return (
    <div className="mt-[68px]">
      <h2 className="text-brightgray mb-[37px] text-lg">GPUs</h2>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
        {response?.data?.gpu_name ? (
          <div className="shadow-default">
            <div className="gpu-resources__header">
              <img src={nvidia_logo} alt="nvidia-logo" />
            </div>
            <div className="gpu-resources__body">
              <h3 className="text-brightgray text-lg">{response.data.gpu_name}</h3>
              <ul className="!p-0">
                <li className="mt-4">
                  <div className="flex flex-wrap justify-between">
                    <span className="flex items-center">Memory&nbsp;</span>
                    <span>
                      {response.data.used_memory} / {response.data.total_memory} GiB
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
    </div>
  );
};

export default GPUResources;

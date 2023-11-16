import nvidia_logo from "assets/images/nvidia_logo.svg";
import useGPUStats from "shared/hooks/useGPUStats";

const GPUResources = () => {
  const { data } = useGPUStats();

  return (
    <>
      <h2 className="text-grey-300 text-lg mt-10 mb-4">GPUs</h2>
      <div className="grid lg:grid-cols-3 sm:grid-cols-2 gap-4">
        {data?.gpus?.map((gpu) => {
          return (
            <div key={gpu.gpu_name}>
              <div className="gpu-resources__header">
                <img src={nvidia_logo} alt="nvidia-logo" />
              </div>
              <div className="gpu-resources__body">
                <h3 className="text-grey-300 text-lg">{gpu.gpu_name}</h3>
                <ul className="!p-0">
                  <li className="mt-4">
                    <div className="flex flex-wrap justify-between">
                      <span className="flex items-center">Memory&nbsp;</span>
                      <span>
                        {gpu.used_memory} / {gpu.total_memory} GiB
                      </span>
                    </div>
                    <div className="progress">
                      <div
                        className="progress-container"
                        style={{
                          width: `${gpu.utilised_memory * 100}%`,
                        }}
                      ></div>
                    </div>
                  </li>
                </ul>
              </div>
            </div>
          );
        }) ?? <p className="text-white opacity-70">No GPUs available</p>}
      </div>
    </>
  );
};

export default GPUResources;

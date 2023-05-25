const ServiceGeneralInfo = () => {
  return (
    <div className="card px-[22px] py-8 mt-4">
      <h3 className="text-brightgray font-bold text-xl mb-6">General</h3>
      <div className="right-general-card">
        <span className="opacity-70">Docker Image</span>
        <span>ghcr.io/premai-io/prem-chat-vicuna-7b-q4-m1</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Default Port</span>
        <span>8001</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Memory Requirements</span>
        <span>16GB</span>
      </div>

      <h3 className="text-brightgray font-bold text-xl my-6">Model Info</h3>
      <div className="right-general-card">
        <span className="opacity-70">Weights Size</span>
        <span>4212859520</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Devices</span>
        <span>m1</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Inference Time</span>
        <span>16GB</span>
      </div>
    </div>
  );
};

export default ServiceGeneralInfo;

import { ServiceGeneralInfoProps } from "../types";

const ServiceGeneralInfo = ({ service }: ServiceGeneralInfoProps) => {
  return (
    <div className="card px-[22px] py-8 mt-4">
      <h3 className="text-brightgray font-bold text-xl mb-6">General</h3>
      <div className="right-general-card">
        <span className="opacity-70">Docker Image</span>
        <span>{service.dockerImage}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Docker Image Size</span>
        <span>{service.dockerImageSize}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Default Port</span>
        <span>{service.defaultPort}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Running Port</span>
        <span>{service.runningPort}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Memory Requirements</span>
        <span className="uppercase">{service.modelInfo.memoryRequirements || "-"}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Volume Name</span>
        <span className="uppercase">{service.volumeName  || "-"}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Volume Path</span>
        <span className="uppercase">{service.volumePath  || "-"}</span>
      </div>

      <div className="right-general-card">
        <span className="opacity-70">Supported</span>
        <span className="uppercase">{service.supported  ? "Yes" : "No"}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Downloaded</span>
        <span className="uppercase">{service.downloaded  ? "Yes" : "No"}</span>
      </div>

      <div className="right-general-card">
        <span className="opacity-70">Running</span>
        <span className="uppercase">{service.running  ? "Yes" : "No"}</span>
      </div>
      

      <h3 className="text-brightgray font-bold text-xl my-6">Model Info</h3>
      <div className="right-general-card">
        <span className="opacity-70">Weights Name</span>
        <span>{service.modelInfo.weightsName || '-'}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Weights Size</span>
        <span>{service.modelInfo.weightsSize || '-'}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Inference Time</span>
        <span>{service.modelInfo.inferenceTime || "-"}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Max Length</span>
        <span>{service.modelInfo.maxLength || "-"}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Token Limit</span>
        <span>{service.modelInfo.tokenLimit || "-"}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Streaming</span>
        <span>{service.modelInfo.streaming ? 'Yes' : 'No'}</span>
      </div>
    </div>
  );
};

export default ServiceGeneralInfo;

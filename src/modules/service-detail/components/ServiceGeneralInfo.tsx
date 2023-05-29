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
        <span className="opacity-70">Default Port</span>
        <span>{service.defaultPort}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Memory Requirements</span>
        <span className="uppercase">{service.modelInfo.memoryRequirements || "-"}</span>
      </div>

      <h3 className="text-brightgray font-bold text-xl my-6">Model Info</h3>
      <div className="right-general-card">
        <span className="opacity-70">Weights Size</span>
        <span>{service.modelInfo.weightsSize || '-'}</span>
      </div>
      <div className="right-general-card">
        <span className="opacity-70">Inference Time</span>
        <span>{service.modelInfo.inferenceTime || "-"}</span>
      </div>
    </div>
  );
};

export default ServiceGeneralInfo;

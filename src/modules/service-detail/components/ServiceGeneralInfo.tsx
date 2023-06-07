import { startCase } from "lodash";
import { ServiceGeneralInfoProps, ServiceInfoValue } from "../types";
import { useMemo } from "react";
import { formatInfo } from "shared/helpers/utils";

const ServiceGeneralInfo = ({ service }: ServiceGeneralInfoProps) => {
  const skippableFields = [
    "id",
    "name",
    "description",
    "documentation",
    "icon",
    "interfaces",
    "modelInfo",
  ];

  const generalInfo = useMemo(() => {
    return Object.entries(service)
      .filter(([key, value]) => !skippableFields.includes(key))
      .map(([key, value]) => ({
        key: startCase(key),
        value: formatInfo(value as ServiceInfoValue),
      }));
  }, [service]);

  const modelInfo = useMemo(() => {
    return Object.entries(service.modelInfo)
      .filter(([key, value]) => !skippableFields.includes(key))
      .map(([key, value]) => ({
        key: startCase(key),
        value: formatInfo(value as ServiceInfoValue),
      }));
  }, [service]);

  return (
    <div className="card px-[22px] py-8 mt-4">
      <h3 className="text-brightgray font-bold text-xl mb-6">General</h3>
      {generalInfo.map((info) => (
        <div className="right-general-card" key={info.key}>
          <span className="opacity-70">{info.key}</span>
          <span>{`${info.value}`}</span>
        </div>
      ))}

      {modelInfo.length > 0 && (
        <h3 className="text-brightgray font-bold text-xl my-6">Model Info</h3>
      )}

      {modelInfo.map((info) => (
        <div className="right-general-card" key={info.key}>
          <span className="opacity-70">{info.key}</span>
          <span>{`${info.value}`}</span>
        </div>
      ))}
    </div>
  );
};

export default ServiceGeneralInfo;

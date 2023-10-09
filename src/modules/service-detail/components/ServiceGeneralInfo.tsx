import { isArray, startCase } from "lodash";
import { useMemo } from "react";
import { formatInfo } from "shared/helpers/utils";

import type { ServiceGeneralInfoProps, ServiceInfoValue } from "../types";

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  const modelInfo = useMemo(() => {
    return Object.entries(service.modelInfo)
      .filter(([key, value]) => !skippableFields.includes(key))
      .map(([key, value]) => ({
        key: startCase(key),
        value: formatInfo(value),
      }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [service]);

  const docUrl = useMemo(() => {
    if (!service.running) {
      return "";
    }
    return `${service.baseUrl}/docs`;
  }, [service.baseUrl, service.running]);

  return (
    <div className="card px-[22px] py-8 mt-4">
      <h3 className="text-grey-300 font-bold text-xl mb-6">General</h3>
      <div className="right-general-card">
        <span className="opacity-70">Docs</span>
        <span>
          {docUrl ? (
            <a
              href={docUrl}
              target="_blank"
              className="text-blue-400 hover:underline"
              rel="noreferrer"
            >
              {docUrl}
            </a>
          ) : (
            "-"
          )}
        </span>
      </div>
      {generalInfo.map((info) => (
        <div className="right-general-card" key={info.key}>
          <span className="opacity-70">{info.key}</span>
          {isArray(info.value) ? (
            <ul className="list-disc right-general-card__list">
              {info.value.map((item, index) => (
                <li key={index}>{item}</li>
              ))}
            </ul>
          ) : (
            <span>{`${info.value}`}</span>
          )}
        </div>
      ))}

      {modelInfo.length > 0 && <h3 className="text-grey-300 font-bold text-xl my-6">Model Info</h3>}

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

import { startCase } from "lodash";
import { ServiceGeneralInfoProps, ServiceInfoValue } from "../types";
import { useMemo } from "react";
import { formatInfo } from "shared/helpers/utils";
import useSettingStore from "shared/store/setting";

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

  const backendUrlFromStore = useSettingStore((state) => state.backendUrl);

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

  const docUrl = useMemo(() => {
    if (!service.running) {
      return "";
    }
    const url = new URL(backendUrlFromStore);
    url.port = service.runningPort.toString();
    url.pathname = "docs";
    return url.toString();
  }, [backendUrlFromStore, service]);

  const envVariableInfoValue = (value: string[]) => {
    return value;
  };

  return (
    <div className="card px-[22px] py-8 mt-4">
      <h3 className="text-brightgray font-bold text-xl mb-6">General</h3>
      <div className="right-general-card">
        <span className="opacity-70">Docs</span>
        <span>
          {!!docUrl ? (
            <a href={docUrl} target="_blank" className="text-blue-400 hover:underline">
              {docUrl}
            </a>
          ) : (
            "-"
          )}
        </span>
      </div>
      {generalInfo.map((info, index) => (
        <div className="right-general-card" key={index}>
          <span className="opacity-70">{info.key}</span>
          {info.key === "Env Variables" && (
            <ul className="list-disc right-general-card__list">
              {envVariableInfoValue(info.value as Array<string>).map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          )}
          {info.key !== "Env Variables" && <span>{`${info.value}`}</span>}
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

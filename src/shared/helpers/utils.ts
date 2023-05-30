import { invoke } from "@tauri-apps/api/tauri";
import { Option, Service, ServiceStatus } from "modules/service/types";
import { CSSObjectWithLabel, ControlProps } from "react-select";

export const SERVICE_CHECK_REFETCH_INTERVAL = 1000;

export const checkIsDockerRunning = async () => {
  const check = await invoke("is_docker_running");
  return Boolean(check);
};

export const checkIsContainerRunning = async () => {
  const check = await invoke("is_container_running");
  return Boolean(check);
};

export const runDockerContainer = async () => {
  const containerRunning = await checkIsContainerRunning();
  if (Boolean(containerRunning)) return;
  await invoke("run_container");
};

export const isBrowserEnv = () => {
  return import.meta.env.VITE_DESTINATION === "browser";
};

export const isDesktopEnv = () => {
  return import.meta.env.VITE_DESTINATION === "desktop";
};

export const isPackaged = () => {
  return import.meta.env.VITE_IS_PACKAGED === "true";
};

export const isBackendSet = () => {
  return import.meta.env.VITE_BACKEND_URL !== undefined && import.meta.env.VITE_BACKEND_URL !== "";
};

const REMOTE_BACKEND_URL = isBackendSet() ? import.meta.env.VITE_BACKEND_URL : "http://localhost:54321";
export const BACKEND_URL = isPackaged() ? `${window.location.protocol}//${window.location.host}/api` : REMOTE_BACKEND_URL;

export const serviceSearchStyle = {
  control: (base: CSSObjectWithLabel, state: ControlProps<Option>) => ({
    ...base,
    backgroundColor: "rgba(77, 77, 79, 0.22)",
    borderColor: state.isFocused ? "transparent" : "transparent",
    padding: 3,
    paddingLeft: 40,
    "&:hover": {
      cursor: "pointer",
      "state.isFocused": {
        borderColor: "transparent",
        backgroundColor: "rgba(77, 77, 79, 0.22)",
        boxShadown: "0",
      },
    },
  }),
  multiValue: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: "transparent",
    border: "1px solid #EDEDED",
    borderRadius: 4,
    padding: "3px 8px",
    alignItems: "center",
    fontFamily: "ProximaNova-Regular",
  }),
  multiValueLabel: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#EDEDED",
    padding: "3px 8px",
    fontSize: 12,
  }),
  multiValueRemove: () => ({
    "&:hover": {
      backgroundColor: "transparent",
    },
  }),
  menuList: (base: CSSObjectWithLabel) => ({
    ...base,
    paddingTop: 0,
    paddingBottom: 0,
    borderRadius: 0,
  }),
  menu: (base: CSSObjectWithLabel) => ({
    ...base,
    zIndex: 100,
  }),
  noOptionsMessage: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: "#20232b",
  }),
  option: (base: CSSObjectWithLabel) => ({
    ...base,
    backgroundColor: "#20232b",
    color: "#EDEDED",
    fontSize: 12,
    fontFamily: "ProximaNova-Regular",
    "&:hover": {
      backgroundColor: "#323232",
    },
  }),
};

export const getServiceStatus = (service: Service): ServiceStatus => {
  if (!service.supported) {
    return "not_supported";
  } else if (!service.downloaded) {
    return "not_downloaded";
  } else if (service.running) {
    return "running";
  }
  // other status will go here
  return "stopped";
};

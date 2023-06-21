import { invoke } from "@tauri-apps/api/tauri";
import { ServiceInfoValue } from "modules/service-detail/types";
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

export const checkIsServerRunning = async () => {
  const url = getBackendUrl();
  const response = await fetch(`${url}/v1/`, { method: "GET" });
  return Boolean(response.ok);
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

export const getBackendUrl = () => {
  let backendURL = "http://localhost:54321";
  if (isBackendSet()) {
    backendURL = import.meta.env.VITE_BACKEND_URL;
  }
  if (isPackaged()) {
    backendURL = `${window.location.protocol}//${window.location.host}/api`;
  }
  return backendURL;
};

export const serviceSearchStyle = {
  control: (base: CSSObjectWithLabel, state: ControlProps<Option>) => ({
    ...base,
    backgroundColor: "rgba(77, 77, 79, 0.22)",
    border: "1.75px solid rgba(237, 237, 237, 0.2)",
    borderColor: state.isFocused ? "transparent" : "transparent",
    padding: 3,
    minHeight: 50,
    paddingLeft: 40,
    boxShadow: "none",
    "&:hover": {
      cursor: "pointer",
      boxShadow: "none",
      "state.isFocused": {
        borderColor: "transparent",
        boxShadow: "none",
      },
    },
  }),
  input: (base: CSSObjectWithLabel) => ({
    ...base,
    color: "#9597A3",
  }),
  placeholder: (base: CSSObjectWithLabel) => {
    return {
      ...base,
      color: "#9597A3",
    };
  },

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
      backgroundColor: "#28282D",
    },
  }),
};

export const getServiceStatus = (service: Service): ServiceStatus => {
  if (service.coming_soon) {
    return "coming_soon";
  } else if (!service.supported) {
    return "not_supported";
  } else if (!service.enoughSystemMemory) {
    return "not_enough_system_memory";
  } else if (!service.enoughMemory) {
    return "not_enough_memory";
  } else if (!service.downloaded) {
    return "not_downloaded";
  } else if (service.running) {
    return "running";
  }
  return "stopped";
};

export const formatInfo = (value: ServiceInfoValue) => {
  if (value === null) {
    return "-";
  } else if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  return value;
};

export const DISPLAY_WELCOME_SCREEN_KEY = "display_welcome_screen";

export const SYSTEM_MEMORY_LIMIT = 8;

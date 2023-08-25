import { invoke } from "@tauri-apps/api/tauri";
import type { Option, Service, ServiceStatus } from "modules/service/types";
import type { ServiceInfoValue } from "modules/service-detail/types";
import type { ControlProps, CSSObjectWithLabel } from "react-select";

import useSettingStore from "../store/setting";

export const SERVICE_CHECK_REFETCH_INTERVAL = 10000;

export const checkIsDockerRunning = async () => {
  const check = await invoke("is_docker_running");
  return Boolean(check);
};

export const checkIsContainerRunning = async () => {
  const check = await invoke("is_container_running");
  return Boolean(check);
};

export const checkIsServerRunning = async () => {
  const url = useSettingStore.getState().backendUrl;
  const response = await fetch(`${url}/v1/`, { method: "GET" });
  return Boolean(response.ok);
};

export const runDockerContainer = async () => {
  const containerRunning = await checkIsContainerRunning();
  if (containerRunning) return;
  await invoke("run_container");
};

export const isBrowserEnv = () => {
  return (
    (window as any).VITE_DESTINATION === "browser" || import.meta.env.VITE_DESTINATION === "browser"
  );
};

export const isDesktopEnv = () => {
  return (
    (window as any).VITE_DESTINATION === "desktop" || import.meta.env.VITE_DESTINATION === "desktop"
  );
};

export const isPackaged = () => {
  return (window as any).VITE_IS_PACKAGED === "true" || import.meta.env.VITE_IS_PACKAGED === "true";
};

export const isBackendSet = () => {
  return (
    ((window as any).VITE_BACKEND_URL !== undefined || import.meta.env.VITE_BACKEND_URL) &&
    ((window as any).VITE_BACKEND_URL !== "" || import.meta.env.VITE_BACKEND_URL !== "")
  );
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
    "&:hover": {
      backgroundColor: "#28282D",
    },
  }),
};

export const getServiceStatus = (service: Service): ServiceStatus => {
  if (service.comingSoon) {
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

export const CHAT_ID = "chat";
export const DIFFUSER_ID = "diffuser";
export const AUDIO_TO_TEXT_ID = "audio-to-text";
export const TEXT_TO_AUDIO_ID = "text-to-audio";
export const UPSCALER_ID = "upscaler";

export const generateUrl = (baseUrl: string, port: number, pathname: string) => {
  const url = new URL(baseUrl);
  url.port = `${port}`;
  url.pathname = pathname;
  return url.toString();
};

export const isDeveloperMode = () => {
  return (window as any).VITE_DEVELOPER_MODE === "1" || import.meta.env.VITE_DEVELOPER_MODE === "1";
};

export const AUDIO_TAB = "AUDIO_TAB";
export const RECORD_TAB = "RECORD_TAB";

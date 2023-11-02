import { invoke } from "@tauri-apps/api/tauri";
import type {
  Option,
  Service,
  ServiceBinary,
  ServiceDocker,
  ServiceStatus,
} from "modules/service/types";
import type { ServiceInfoValue } from "modules/service-detail/types";
import type { ControlProps, CSSObjectWithLabel } from "react-select";

export const SERVICE_CHECK_REFETCH_INTERVAL = 10000;

export const petalsModels = async (): Promise<string[]> => {
  const models = await invoke("get_petals_models");
  return models as string[];
};

export const isIP = (host: string): boolean => {
  if (host.includes("localhost")) return true;
  /**
   * ^ start of string
   *   (?!0)         Assume IP cannot start with 0
   *   (?!.*\.$)     Make sure string does not end with a dot
   *   (
   *     (
   *     1?\d?\d|   A single digit, two digits, or 100-199
   *     25[0-5]|   The numbers 250-255
   *     2[0-4]\d   The numbers 200-249
   *     )
   *   \.|$ the number must be followed by either a dot or end-of-string - to match the last number
   *   ){4}         Expect exactly four of these
   * $ end of string
   */
  const ipAddressPattern = /^(?!0)(?!.*\.$)((1?\d?\d|25[0-5]|2[0-4]\d)(\.|$)){4}$/;
  return ipAddressPattern.test(host);
};

export const isBrowserEnv = () => {
  return !("__TAURI__" in window);
};

export const isDesktopEnv = () => {
  return "__TAURI__" in window;
};

export const isServiceBinary = (service: Service): service is ServiceBinary => {
  return service && service.serviceType === "binary";
};

export const isServiceDocker = (service: Service): service is ServiceDocker => {
  return service && service.serviceType === "docker";
};

export const swarmSupported = async () => {
  const check = await invoke("is_swarm_supported");
  return Boolean(check);
};

export const userName = async () => {
  return await invoke("get_username");
};

export const checkSwarmModeRunning = async () => {
  const check = await invoke("is_swarm_mode_running");
  return Boolean(check);
};

export const stopSwarmMode = async () => {
  await invoke("stop_swarm_mode");
};

export const createEnvironment = async () => {
  await invoke("create_environment");
};

export const deleteEnvironment = async () => {
  await invoke("delete_environment");
};

export const runSwarmMode = async (numBlocks: number, model: string, publicName: string) => {
  const isSwarmMode = await checkSwarmModeRunning();
  if (isSwarmMode) {
    return;
  }
  await invoke("run_swarm", { numBlocks, model, publicName });
};

export const isPackaged = () => {
  return (window as any).VITE_IS_PACKAGED === "true" || import.meta.env.VITE_IS_PACKAGED === "true";
};

export const isProxyEnabled = () => {
  return (
    (window as any).VITE_PROXY_ENABLED === "true" || import.meta.env.VITE_PROXY_ENABLED === "true"
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
  if ((!service.serviceType || service.serviceType === "docker") && isDesktopEnv()) {
    return "docker_only";
  } else if (service.comingSoon) {
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

export const checkIfAccessible = (status: ServiceStatus): boolean => {
  return ![
    "docker_only",
    "not_supported",
    "not_enough_memory",
    "not_enough_system_memory",
    "coming_soon",
  ].includes(status);
};

export const formatInfo = (value: any): ServiceInfoValue => {
  if (value === null) {
    return "-";
  } else if (typeof value === "boolean") {
    return value ? "Yes" : "No";
  }
  if (typeof value === "object" && !Array.isArray(value) && value !== null) {
    return Object.entries(value).flatMap(([k, v]) => `${k}=${v ?? "null"}`);
  }
  return value;
};

export const CHAT_ID = "chat";
export const DIFFUSER_ID = "diffuser";
export const AUDIO_TO_TEXT_ID = "audio-to-text";
export const TEXT_TO_AUDIO_ID = "text-to-audio";
export const UPSCALER_ID = "upscaler";
export const CODER_ID = "coder";

export const isDeveloperMode = () => {
  return (window as any).VITE_DEVELOPER_MODE === "1" || import.meta.env.VITE_DEVELOPER_MODE === "1";
};

export const AUDIO_TAB = "AUDIO_TAB";
export const RECORD_TAB = "RECORD_TAB";

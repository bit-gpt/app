import { Service, ServiceStatus } from "modules/service/types";

export type ServiceHeaderProps = {
  icon: string;
  title: string;
  tags: string[];
  subtitle: string;
  isInBeta: boolean;
};

export type ServiceDocumentationProps = {
  description: string;
};

export type ServiceDescriptionProps = {
  description: string;
};

export type ServiceGeneralInfoProps = {
  service: Service;
};

export type ServiceResourceBarsProps = {
  serviceId: string;
  status: ServiceStatus;
};

export type ServiceInfoValue = string | number | null | boolean;

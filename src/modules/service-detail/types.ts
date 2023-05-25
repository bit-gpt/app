import { Service } from "modules/service/types";

export type ServiceHeaderProps = {
    icon: string;
    title: string;
    tags: string[];
    subtitle: string;
}

export type ServiceDocumentationProps = {
    description: string;
}

export type ServiceDescriptionProps = {
    description: string;
}

export type ServiceGeneralInfoProps = {
    service: Service
}
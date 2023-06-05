import Markdown from "shared/components/Markdown";
import { ServiceDocumentationProps } from "../types";

const ServiceDocumentation = (props: ServiceDocumentationProps) => {
  const { description } = props;
  return (
    <div className="card xl:px-16 md:px-10 px-4 py-8 xl:max-w-[60%] w-full service-detail__documentation scrollbar-custom">
      <Markdown>{description}</Markdown>
    </div>
  );
};

export default ServiceDocumentation;

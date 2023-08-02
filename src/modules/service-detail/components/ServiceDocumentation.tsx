import Markdown from "shared/components/Markdown";

import type { ServiceDocumentationProps } from "../types";

const ServiceDocumentation = (props: ServiceDocumentationProps) => {
  const { description } = props;
  return (
    <div className="card xl:px-16 md:px-10 px-4 md:py-8 py-4 lg:w-[60%] scrollbar-custom">
      <Markdown>{description}</Markdown>
    </div>
  );
};

export default ServiceDocumentation;

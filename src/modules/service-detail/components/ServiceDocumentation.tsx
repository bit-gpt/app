import { ServiceDocumentationProps } from "../types";

const ServiceDocumentation = (props: ServiceDocumentationProps) => {
  const { description } = props;
  return (
    <div className="card xl:px-16 md:px-10 px-4 py-8 xl:max-w-[60%] w-full">
      <div className="service-detail__documentation" dangerouslySetInnerHTML={{ __html: description }}></div>
    </div>
  );
};

export default ServiceDocumentation;

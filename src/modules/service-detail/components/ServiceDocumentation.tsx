import { ServiceDocumentationProps } from "../types";

const ServiceDocumentation = (props: ServiceDocumentationProps) => {
  const { description } = props;
  return (
    <div className="card xl:px-16 px-10 py-8 xl:max-w-[60%] w-full">
      <div dangerouslySetInnerHTML={{ __html: description }}></div>
    </div>
  );
};

export default ServiceDocumentation;

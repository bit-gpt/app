import Markdown from "shared/components/Markdown";
import { ServiceDescriptionProps } from "../types";

const ServiceDescription = ({ description }: ServiceDescriptionProps) => {
  return (
    <div className="card md:px-[38px] px-[22px] md:py-8 md:mt-4">
      <h3 className="text-brightgray font-bold text-xl mb-6">Description</h3>
      <Markdown>{description}</Markdown>
    </div>
  );
};
export default ServiceDescription;

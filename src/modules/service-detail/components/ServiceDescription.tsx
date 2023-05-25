import { ServiceDescriptionProps } from "../types";

const ServiceDescription = ({ description }: ServiceDescriptionProps) => {
  return (
    <div className="card px-[38px] py-8 mt-4">
      <h3 className="text-brightgray font-bold text-xl mb-6">Description</h3>
      <p
        className="text-brightgray text-sm font-proximaNova-regular"
        dangerouslySetInnerHTML={{ __html: description }}
      ></p>
    </div>
  );
};
export default ServiceDescription;

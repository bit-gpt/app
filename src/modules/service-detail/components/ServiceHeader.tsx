import TagsOutline from "shared/components/TagsOutline";
import { ServiceHeaderProps } from "../types";

const ServiceHeader = (props: ServiceHeaderProps) => {
  const { tags, icon, subtitle, title } = props;
  return (
    <div className="flex flex-wrap max-md:gap-4">
      <div className="dashboard-bottom__card-box">
        <img src={icon} alt={title} />
      </div>
      <div className="mask-heading md:ml-6">
        <h2 className="!mt-0 mb-1">{title}</h2>
        <span className="text-brightgray">{subtitle}</span>
      </div>
      <div className="gap-[14px] mt-[6px] flex items-start ml-8">
        {tags.map((tag) => (
          <TagsOutline key={tag} className="text-sm rounded-md px-4 py-1 capitalize">
            {tag}
          </TagsOutline>
        ))}
      </div>
    </div>
  );
};

export default ServiceHeader;

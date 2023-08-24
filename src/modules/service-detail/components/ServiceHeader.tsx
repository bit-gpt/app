import Beta from "modules/service/components/Beta";
import TagsOutline from "shared/components/TagsOutline";

import type { ServiceHeaderProps } from "../types";

const ServiceHeader = (props: ServiceHeaderProps) => {
  const { tags, icon, subtitle, title, isInBeta } = props;
  return (
    <div className="flex flex-wrap max-lg:gap-3">
      <div className="service-card__logo">
        <img src={icon} alt={title} />
      </div>
      <div className="mask-heading lg:ml-6">
        <div className="flex items-start">
          <h2 className="!mt-0 md:mb-1">{title}</h2>
          {isInBeta && <Beta className="md:top-2 top-3" />}
        </div>
        <span className="text-grey-300">{subtitle}</span>
      </div>
      <div className="gap-[14px] md:mt-[6px] flex md:items-start items-center lg:ml-8">
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

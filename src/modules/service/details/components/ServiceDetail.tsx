import AppContainer from "shared/components/AppContainer";
import icon from "../../../../assets/images/chat.svg";
import TagsOutline from "shared/components/TagsOutline";
import DeleteIcon from "shared/components/DeleteIcon";
import PlayIcon from "shared/components/PlayIcon";
import Documentation from "./Documentation";
import RightSidebar from "./RightSidebar";

const ServiceDetail = () => {
  return (
    <AppContainer>
      <div className="flex items-start mb-[62px]">
        <div className="flex">
          <div className="dashboard-bottom__card-box w-[50px] h-[60px]">
            <img
              src={icon}
              alt="icon"
              className="rounded-[11px] w-[28px] h-[28px]"
            />
          </div>
          <div className="mask-heading ml-6">
            <h2 className="!mt-0 mb-1">Vicuna 7B Q4</h2>
            <span className="text-brightgray">vicuna-7b-q4</span>
          </div>
          <div className="gap-[14px] flex items-start ml-8">
            <TagsOutline className="text-sm rounded-md px-4 py-1">
              Chat
            </TagsOutline>
            <TagsOutline className="text-sm rounded-md px-4 py-1">
              Embeddings
            </TagsOutline>
          </div>
        </div>
        <div className="flex ml-auto">
          <button className="bg-brightgray rounded-3xl px-6 py-[10px] text-sm mr-4">
            Play &nbsp; &#8594;
          </button>
          <button className="px-2">
            <PlayIcon />
          </button>
          <button className="px-2">
            <DeleteIcon />
          </button>
        </div>
      </div>
      <div className="service-detail">
        <Documentation />
        <RightSidebar />
      </div>
    </AppContainer>
  );
};

export default ServiceDetail;

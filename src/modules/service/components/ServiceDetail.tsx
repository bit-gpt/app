import AppContainer from "shared/components/AppContainer";
import icon from "../../../assets/images/chat.svg";

const ServiceDetail = () => {
  return (
    <AppContainer>
      <div className="flex">
        <div className="dashboard-bottom__card-box w-[50px] h-[60px]">
          <img
            src={icon}
            alt="icon"
            className="rounded-[11px] w-[28px] h-[28px]"
          />
        </div>
        <div className="mask-heading ml-6">
          <h2 className="!mt-0">Vicuna 7B Q4</h2>
        </div>
      </div>
    </AppContainer>
  );
};

export default ServiceDetail;

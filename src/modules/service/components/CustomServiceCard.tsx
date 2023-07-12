import { useState } from "react";
import icon from "../../../assets/images/chat.svg";
import PrimaryButton from "shared/components/PrimaryButton";
import CustomServiceModal from "./CustomServiceModal";

const CustomServiceCard = () => {
  const [openCustomService, setOpenCustomService] = useState(false);

  return (
    <>
      <div className={"dashboard-bottom__card flex-wrap"}>
        <div className="flex gap-8 items-start flex-wrap w-full relative">
          <div className="dashboard-bottom__card-box">
            <img src={icon} alt={"logo"} />
          </div>
          <PrimaryButton
            className="!rounded-[14px] !px-5 !py-0 !text-[10px] !h-[30px] flex items-center"
            onClick={() => setOpenCustomService(true)}
          >
            Add
          </PrimaryButton>
        </div>
        <h3>Custom Service</h3>
      </div>
      {openCustomService && (
        <CustomServiceModal
          isOpen={openCustomService}
          closeModal={() => setOpenCustomService(false)}
        />
      )}
    </>
  );
};

export default CustomServiceCard;

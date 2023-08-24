import { useState } from "react";
import PrimaryButton from "shared/components/PrimaryButton";

import icon from "../../../assets/images/chat.svg";

import CustomServiceModal from "./CustomServiceModal";

const CustomServiceCard = () => {
  const [openCustomService, setOpenCustomService] = useState(false);

  return (
    <>
      <div className="service-card flex-wrap">
        <div className="flex gap-8 items-start flex-wrap w-full relative">
          <div className="service-card__logo bg-primary-light p-3 rounded-lg">
            <img src={icon} alt={"logo"} className="!w-6 !h-6 !rounded" />
          </div>
          <div className="flex flex-wrap items-center gap-4 ml-auto">
            <PrimaryButton
              className="!rounded-[14px] !px-5 !py-0 !text-[10px] !h-[30px] flex items-center"
              onClick={() => setOpenCustomService(true)}
            >
              Add
            </PrimaryButton>
          </div>
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

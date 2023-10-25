import uploadIcon from "assets/images/upload.svg";
import clsx from "clsx";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "shared/components/PrimaryButton";
import type { PremUpscalerHistory } from "shared/types";

import type { Service } from "../../service/types";

const PremUpscalerImageBox = ({
  serviceId,
  serviceType,
  history,
}: {
  serviceId: string;
  serviceType: Service["serviceType"];
  history: PremUpscalerHistory;
}) => {
  const navigate = useNavigate();

  const redirecToIndex = () => {
    navigate(`/prem-upscaler/${serviceId}/${serviceType}`);
  };

  return (
    <div className="md:m-[50px] gap-10 m-[25px] prem-img-promptbox">
      <div className="max-w-[950px] mx-auto">
        <PrimaryButton
          className="px-4 flex items-center !py-2 !h-[38px] !text-sm mb-[26px]"
          onClick={redirecToIndex}
        >
          <p className="pr-4 ">Upload a photo</p>
          <div className="pl-4 btn-primary--addon">
            <img src={uploadIcon} alt="msg" width={14} height={14} />
          </div>
        </PrimaryButton>
        <div>
          <img className="w-full object-contain" src={history.file} alt="input" />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <a href={history.file} download onClick={(e) => e.stopPropagation()}>
            <PrimaryButton
              className={clsx(
                "!px-12 flex items-center !py-2 !h-[38px] !text-sm max-sm:justify-center max-sm:!h-10",
              )}
            >
              Download
            </PrimaryButton>
          </a>
        </div>
      </div>
    </div>
  );
};

export default PremUpscalerImageBox;

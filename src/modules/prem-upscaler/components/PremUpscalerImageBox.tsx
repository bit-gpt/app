import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import PrimaryButton from "shared/components/PrimaryButton";
import { PremUpscalerHistory } from "shared/types";
import uploadIcon from "assets/images/upload.svg";

const PremUpscalerImageBox = ({
  serviceId,
  history,
}: {
  serviceId: string;
  history: PremUpscalerHistory;
}) => {
  const navigate = useNavigate();

  const redirecToIndex = () => {
    navigate(`/prem-upscaler/${serviceId}`);
  };

  return (
    <div className="md:m-[50px] gap-10 m-[25px] prem-img-promptbox">
      <div className="max-w-[650px] mx-auto">
        <PrimaryButton
          className="px-4 flex items-center !py-2 !h-[38px] !text-sm mb-4"
          onClick={redirecToIndex}
        >
          <p className="pr-4 font-proximaNova-regular">Upload a photo</p>
          <div className="pl-4 btn-primary--addon">
            <img src={uploadIcon} alt="msg" width={14} height={14} />
          </div>
        </PrimaryButton>
        <div className="prem-audio-box bg-darkcharcoal">
          <img src={history.file} alt="input" />
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <a href={history.file} download onClick={(e) => e.stopPropagation()}>
            <PrimaryButton
              className={clsx(
                "!px-12 flex items-center !py-2 !h-[38px] !text-sm maxSm:w-1/2 maxSm:justify-center maxSm:!h-10"
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

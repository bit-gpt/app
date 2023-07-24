import { useCallback } from "react";
import { useNavigate } from "react-router-dom";
import clsx from "clsx";
import PrimaryButton from "shared/components/PrimaryButton";
import OutlineCircleButton from "shared/components/OutlineCircleButton";
import { PremUpscalerContainerProps } from "../types";
import { useDropzone } from "react-dropzone";
import uploadIcon from "assets/images/upload.svg";
import usePremUpscaler from "shared/hooks/usePremUpscaler";

const PremUpscalerBox = ({ serviceId, historyId }: Partial<PremUpscalerContainerProps>) => {
  const navigate = useNavigate();

  const { isLoading, onSubmit, file, setFile } = usePremUpscaler(serviceId!, historyId);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
    },
    [setFile]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".svg"],
    },
  });

  const generateImages = () => {
    if (!file) return;
    onSubmit();
  };

  const onClear = () => {
    setFile(null);
    navigate(`/prem-upscaler/${serviceId}`);
  };

  return (
    <div className="md:m-[50px] gap-10 m-[25px] prem-img-promptbox">
      <div className="max-w-[650px] mx-auto">
        <div
          className={clsx("prem-audio-box bg-darkcharcoal", { "pointer-events-none": isLoading })}
        >
          <p className="mb-[18px] text-spanishgray">Pick an image to increase resolution</p>
          <div
            className="border-2 border-lavendergray rounded-lg h-[162px] flex justify-center items-center flex-col"
            {...getRootProps()}
          >
            <input type="file" {...getInputProps()} />
            <PrimaryButton className="px-4 flex items-center !py-2 !h-[38px] !text-sm">
              <p className="pr-4 font-proximaNova-regular">Upload a photo</p>
              <div className="pl-4 btn-primary--addon">
                <img src={uploadIcon} alt="msg" width={14} height={14} />
              </div>
            </PrimaryButton>
            <span className="text-spanishgray mt-[14px]">
              {isDragActive ? "Drop the files here ..." : "or drag a file here"}
            </span>
          </div>
          {file && <span>{file.name}</span>}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <OutlineCircleButton
            className={clsx(
              "!rounded-md !h-[40px] text-white items-center flex border border-[#EC898A] !px-12 !text-sm maxSm:w-1/2 maxSm:justify-center",
              {
                "opacity-50 pointer-events-none": isLoading,
              }
            )}
            onClick={onClear}
            disabled={isLoading}
          >
            Clear
          </OutlineCircleButton>
          <PrimaryButton
            className={clsx(
              "!px-12 flex items-center !py-2 !h-[38px] !text-sm maxSm:w-1/2 maxSm:justify-center maxSm:!h-10",
              {
                "opacity-50": !file,
                "animate-fill-effect": isLoading,
              }
            )}
            onClick={generateImages}
            disabled={isLoading || !file}
          >
            Submit
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default PremUpscalerBox;

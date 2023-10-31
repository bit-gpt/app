import uploadIcon from "assets/images/upload.svg";
import clsx from "clsx";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { useNavigate } from "react-router-dom";
import OutlineCircleButton from "shared/components/OutlineCircleButton";
import PrimaryButton from "shared/components/PrimaryButton";
import usePremUpscaler from "shared/hooks/usePremUpscaler";

import type { PremUpscalerContainerProps } from "../types";

const PremUpscalerBox = ({
  serviceId,
  serviceType,
  historyId,
}: Partial<PremUpscalerContainerProps>) => {
  const navigate = useNavigate();

  const { isPending, onSubmit, file, setFile } = usePremUpscaler(
    serviceId!,
    serviceType!,
    historyId,
  );
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [],
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
    navigate(`/prem-upscaler/${serviceId}/${serviceType}`);
  };

  return (
    <div className="md:m-[50px] gap-10 m-[25px] prem-img-promptbox">
      <div className="max-w-[650px] mx-auto">
        <div className={clsx("prem-audio-box bg-grey-700", { "pointer-events-none": isPending })}>
          <p className="mb-[18px] text-grey-400">Pick an image to increase resolution</p>
          <div
            className="border-2 border-grey-400 rounded-lg h-[162px] flex justify-center items-center flex-col"
            {...getRootProps()}
          >
            <input type="file" {...getInputProps()} />
            <PrimaryButton className="px-4 flex items-center !py-2 !h-[38px] !text-sm">
              <p className="pr-4 ">Upload a photo</p>
              <div className="pl-4 btn-primary--addon">
                <img src={uploadIcon} alt="msg" width={14} height={14} />
              </div>
            </PrimaryButton>
            <span className="text-grey-400 mt-[14px]">
              {isDragActive ? "Drop the files here ..." : "or drag a file here"}
            </span>
          </div>
          {file && <span>{file.name}</span>}
        </div>

        <div className="mt-4 flex justify-end gap-3">
          <OutlineCircleButton
            className={clsx(
              "!rounded-md !h-[40px] text-white items-center flex border border-[#EC898A] !px-12 !text-sm max-sm:w-1/2 max-sm:justify-center",
              {
                "opacity-50 pointer-events-none": isPending,
              },
            )}
            onClick={onClear}
            disabled={isPending}
          >
            Clear
          </OutlineCircleButton>
          <PrimaryButton
            className={clsx(
              "!px-12 flex items-center !py-2 !h-[38px] !text-sm max-sm:w-1/2 max-sm:justify-center max-sm:!h-10",
              {
                "opacity-50": !file,
                "animate-fill-effect": isPending,
              },
            )}
            onClick={generateImages}
            disabled={isPending || !file}
          >
            Submit
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default PremUpscalerBox;

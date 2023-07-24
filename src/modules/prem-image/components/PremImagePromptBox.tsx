import PrimaryButton from "shared/components/PrimaryButton";
import { PremImageResponse } from "../types";
import clsx from "clsx";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import uploadIcon from "assets/images/upload.svg";
import usePremImage from "shared/hooks/usePremImage";
import { useNavigate } from "react-router-dom";

type PromptProps = Pick<
  PremImageResponse,
  | "prompt"
  | "setPrompt"
  | "negativePrompt"
  | "setNegativePrompt"
  | "isLoading"
  | "serviceId"
  | "historyId"
>;

const PremImagePromptBox = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  isLoading,
  historyId,
  serviceId,
}: PromptProps) => {
  const { n, file, setFile, onSubmit } = usePremImage(serviceId, historyId);

  const generateImages = () => {
    if (!prompt) return;
    onSubmit();
  };

  const onDrop = useCallback((acceptedFiles: File[]) => {
    setFile(acceptedFiles[0]);
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    multiple: false,
    noDrag: true,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png", ".svg"],
    },
    onDropRejected() {
      toast.error("Please upload a valid image file");
    },
  });

  return (
    <div className="md:mt-[50px] mb-10 mx-[50px] flex maxLg:flex-wrap gap-10 prem-img-promptbox">
      <div className="flex lg:w-1/2 w-full flex-col">
        <span className="bg-darkcharcoal py-2 px-[14px] min-w-[129px] w-fit rounded-tl rounded-tr">
          Prompt
        </span>
        <textarea
          className="h-[150px]"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        ></textarea>
        <div className="mt-10" {...getRootProps()}>
          <input type="file" {...getInputProps()} />
          <PrimaryButton className="px-4 flex items-center !py-2 !h-[38px] !text-sm">
            <p className="pr-4 font-proximaNova-regular">Upload a photo</p>
            <div className="pl-4 btn-primary--addon">
              <img src={uploadIcon} alt="msg" width={14} height={14} />
            </div>
          </PrimaryButton>
          {file && <span className="mt-1 text-white">{file.name}</span>}
        </div>
      </div>
      <div className="flex lg:w-1/2 w-full flex-col">
        <div className="flex">
          <span className="bg-darkcharcoal py-2 px-[14px] w-fit rounded-tl rounded-tr">
            Negative Prompt
          </span>
          <span className="ml-auto">Optional</span>
        </div>
        <textarea
          className="h-[88px]"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
        ></textarea>
        <div className="pt-3 flex flex-wrap maxMd:gap-2">
          <PrimaryButton
            className={clsx("!px-12 !pt-2 !text-sm", {
              "opacity-50": !prompt,
              "animate-fill-effect": isLoading,
            })}
            onClick={generateImages}
            disabled={isLoading || !prompt}
          >
            {isLoading ? `Generating ${n} Images` : `Generate Image`}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default PremImagePromptBox;

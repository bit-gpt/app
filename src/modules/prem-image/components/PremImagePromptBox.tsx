import uploadIcon from "assets/images/upload.svg";
import clsx from "clsx";
import { useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { toast } from "react-toastify";
import ImgThumbCloseIcon from "shared/components/ImgThumbCloseIcon";
import PrimaryButton from "shared/components/PrimaryButton";
import usePremImageStore from "shared/store/prem-image";

import type { PremImageResponse } from "../types";

type PromptProps = Pick<
  PremImageResponse,
  "prompt" | "setPrompt" | "negativePrompt" | "setNegativePrompt" | "isPending" | "setFile" | "file"
>;

const PremImagePromptBox = ({
  prompt,
  setPrompt,
  negativePrompt,
  setNegativePrompt,
  isPending,
  generateImages,
  file,
  setFile,
}: PromptProps & {
  generateImages: () => void;
}) => {
  const n = usePremImageStore((state) => state.n);
  const onDrop = useCallback(
    (acceptedFiles: File[]) => {
      setFile(acceptedFiles[0]);
    },
    [setFile],
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    multiple: false,
    noDrag: true,
    accept: {
      "image/*": [".jpeg", ".jpg", ".png"],
    },
    onDropRejected() {
      toast.error("Please upload a valid image file");
    },
  });

  const imageClose = (e: any) => {
    if (file) {
      setFile(e.target.files);
    }
  };

  return (
    <div className="md:mt-[50px] mb-10 mx-[50px] flex max-lg:flex-wrap gap-10 prem-img-promptbox">
      <div className="flex lg:w-1/2 w-full flex-col">
        <span className="bg-grey-700 py-2 px-[14px] min-w-[129px] w-fit rounded-tl rounded-tr">
          Prompt
        </span>
        <textarea
          className="h-[134px]"
          onChange={(e) => setPrompt(e.target.value)}
          value={prompt}
        ></textarea>
        <div className="upload-photo-preview mt-4 flex">
          {file && (
            <div className="relative">
              <button onClick={imageClose}>
                <ImgThumbCloseIcon />
              </button>
              <img src={URL.createObjectURL(file)} alt="" />
            </div>
          )}
        </div>
        <div className="mt-5 w-max" {...getRootProps()}>
          <input type="file" {...getInputProps()} />
          <PrimaryButton className="pl-4 !pr-0 flex items-center !py-2 !h-[38px] !text-sm">
            <p className="pr-4 ">Upload a photo</p>
            <div className="px-4 btn-primary--addon">
              <img src={uploadIcon} alt="msg" width={14} height={14} />
            </div>
          </PrimaryButton>
          {file && <span className="mt-1 text-white">{file.name}</span>}
        </div>
      </div>
      <div className="flex lg:w-1/2 w-full flex-col">
        <div className="flex">
          <span className="bg-grey-700 py-2 px-[14px] w-fit rounded-tl rounded-tr">
            Negative Prompt
          </span>
          <span className="ml-auto">Optional</span>
        </div>
        <textarea
          className="h-[134px]"
          value={negativePrompt}
          onChange={(e) => setNegativePrompt(e.target.value)}
        ></textarea>
        <div className="mt-5 flex flex-wrap max-md:gap-2">
          <PrimaryButton
            className={clsx("!px-8 !py-2 !h-[38px] !text-sm", {
              "opacity-50": !prompt,
              "animate-fill-effect": isPending,
            })}
            onClick={generateImages}
            disabled={isPending || !prompt}
          >
            {isPending ? `Generating ${n} Images` : `Generate Image`}
          </PrimaryButton>
        </div>
      </div>
    </div>
  );
};

export default PremImagePromptBox;

import React from "react";
import OutlineCircleButton from "../../shared/components/OutlineCircleButton";

type DownloadButton = {
  onClick?: () => void;
};

const DownloadButton = ({ onClick }: DownloadButton) => {
  return (
    <OutlineCircleButton type="button" onClick={onClick}>
      Download
      <span className="ml-3">&#10230;</span>
    </OutlineCircleButton>
  );
};

export default DownloadButton;

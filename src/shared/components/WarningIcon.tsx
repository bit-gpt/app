interface WarningIconProps {
  className?: string;
}
const WarningIcon = ({ className }: WarningIconProps) => {
  return (
    <svg
      className={className}
      width="33"
      height="33"
      viewBox="0 0 37 34"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g filter="url(#filter0_d_1131_265)">
        <path
          d="M17.0222 6.55963C17.679 5.42202 19.321 5.42202 19.9778 6.55963L29.5796 23.1904C30.2364 24.328 29.4154 25.75 28.1018 25.75H8.89824C7.58464 25.75 6.76363 24.328 7.42044 23.1904L17.0222 6.55963Z"
          fill="#F39894"
        />
        <path
          d="M18.5 12.7822V17.9703"
          stroke="#F7F0ED"
          strokeWidth="2.27523"
          strokeLinecap="round"
        />
        <circle cx="18.365" cy="21.03" r="1.06422" fill="#F7F0ED" />
      </g>
      <defs>
        <filter
          id="filter0_d_1131_265"
          x="0.361812"
          y="0.0179809"
          width="36.2764"
          height="33.6953"
          filterUnits="userSpaceOnUse"
          colorInterpolationFilters="sRGB"
        >
          <feFlood floodOpacity="0" result="BackgroundImageFix" />
          <feColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <feOffset dy="1.13761" />
          <feGaussianBlur stdDeviation="3.41284" />
          <feComposite in2="hardAlpha" operator="out" />
          <feColorMatrix type="matrix" values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0.1 0" />
          <feBlend mode="normal" in2="BackgroundImageFix" result="effect1_dropShadow_1131_265" />
          <feBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1131_265"
            result="shape"
          />
        </filter>
      </defs>
    </svg>
  );
};

export default WarningIcon;

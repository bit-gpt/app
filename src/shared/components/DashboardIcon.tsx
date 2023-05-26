import { DashboardIconPorps } from "shared/types";

const DashboardIcon = ({ className }: DashboardIconPorps) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <g clipPath="url(#clip0_1862_931)">
        <path
          d="M18.3333 4.76984V1.66651C18.3333 1.20651 17.9608 0.833177 17.5 0.833177C17.0392 0.833177 16.6667 1.20651 16.6667 1.66651V3.63818L12.3308 0.712344C10.915 -0.242656 9.085 -0.242656 7.66917 0.712344L1.83583 4.64901C0.686667 5.42484 0 6.71568 0 8.10318V15.8332C0 18.1307 1.86917 19.9998 4.16667 19.9998H5.83333C6.29417 19.9998 6.66667 19.6265 6.66667 19.1665V11.6665C6.66667 11.2073 7.04 10.8332 7.5 10.8332H12.5C12.96 10.8332 13.3333 11.2073 13.3333 11.6665V19.1665C13.3333 19.6265 13.7058 19.9998 14.1667 19.9998H15.8333C18.1308 19.9998 20 18.1307 20 15.8332V8.10318C20 6.78568 19.38 5.55484 18.3333 4.76984Z"
          fill="#fff"
        />
      </g>
      <defs>
        <clipPath id="clip0_1862_931">
          <rect width="20" height="20" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default DashboardIcon;

import type { PipelineIconProps } from "shared/types";

const PipelineIcon = ({ className }: PipelineIconProps) => {
  return (
    <svg
      className={className}
      width="20"
      height="20"
      viewBox="0 0 29 29"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M28.9862 20.41C28.9862 21.2175 28.9748 22.0363 28.9862 22.8437C29.009 24.0151 28.5427 24.959 27.5533 25.5617C26.0066 26.4943 24.4373 27.4041 22.8451 28.2684C21.9467 28.7688 20.98 28.7574 20.0816 28.257C18.4099 27.3358 16.7609 26.3806 15.1232 25.4139C14.8048 25.2319 14.5774 25.2092 14.2476 25.4025C12.7692 26.2782 11.268 27.1084 9.80095 27.9954C8.54999 28.746 7.32177 28.8142 6.0708 28.0523C4.55827 27.1311 2.95476 26.3578 1.51046 25.3343C0.794 24.8225 0.407337 24.0833 0.395965 23.2076C0.37322 21.3426 0.37322 19.4661 0.395965 17.601C0.407337 16.714 0.805372 15.9862 1.49909 15.463C2.69319 14.5646 4.05788 13.9505 5.33159 13.1658C5.92296 12.8019 6.55981 12.4948 7.13981 12.1195C7.66294 11.7784 8.14058 11.8011 8.67508 12.1082C10.4492 13.1544 12.2347 14.1552 13.9974 15.2128C14.4864 15.5085 14.8617 15.5426 15.3848 15.2356C17.1817 14.1552 19.0126 13.1431 20.8095 12.0741C21.2871 11.7897 21.7192 11.7897 22.1855 12.0627C23.9141 13.0748 25.6541 14.0529 27.3713 15.065C28.4631 15.7132 29.0431 16.6685 28.9976 17.965C28.9748 18.7952 28.9862 19.6026 28.9862 20.41ZM8.59548 23.8672C8.59548 24.7202 8.60685 25.5617 8.58411 26.4147C8.57273 26.8923 8.7092 26.9151 9.08449 26.699C10.5743 25.8233 12.0868 24.959 13.588 24.0947C13.8495 23.9469 13.9519 23.7535 13.9405 23.4578C13.9291 21.7406 13.9291 20.0234 13.9405 18.3061C13.9405 17.874 13.8154 17.8057 13.4515 18.0218C11.9731 18.8861 10.4833 19.7504 8.99351 20.6034C8.67509 20.7853 8.56136 21.0241 8.57273 21.3881C8.61822 22.2069 8.59548 23.0371 8.59548 23.8672ZM15.3962 20.9104C15.3962 21.7179 15.4189 22.5367 15.3848 23.3441C15.3734 23.7422 15.5213 23.9696 15.8625 24.1516C17.3409 24.9817 18.8079 25.8347 20.275 26.699C20.6275 26.9037 20.764 26.8809 20.7526 26.426C20.7412 24.7316 20.7412 23.0257 20.7526 21.3312C20.7526 21.0128 20.673 20.7967 20.3887 20.6375C18.8648 19.7618 17.3522 18.8861 15.8283 17.9991C15.4417 17.7716 15.3848 17.965 15.3848 18.3061C15.4076 19.1704 15.3962 20.0347 15.3962 20.9104ZM22.1969 23.8445C22.1969 24.6747 22.1969 25.5049 22.1969 26.3351C22.1969 26.9492 22.2083 26.9605 22.72 26.6649C23.9824 25.9484 25.222 25.1978 26.4957 24.4927C27.2008 24.1061 27.5306 23.5261 27.5419 22.7527C27.5533 21.263 27.5419 19.7732 27.5533 18.2834C27.5533 17.874 27.4168 17.8171 27.087 18.0105C25.5859 18.8861 24.0847 19.7618 22.5836 20.6261C22.2765 20.7967 22.1855 21.0241 22.1855 21.3653C22.2083 22.1841 22.1969 23.0143 22.1969 23.8445ZM7.16255 23.8672C7.16255 23.0143 7.15118 22.1728 7.16255 21.3198C7.16255 21.0014 7.07157 20.7853 6.78726 20.6261C5.26336 19.7618 3.75083 18.8748 2.2383 17.9991C1.93124 17.8285 1.79477 17.8626 1.80614 18.2493C1.81752 19.7732 1.80614 21.3085 1.81752 22.8324C1.82889 23.5374 2.13594 24.0833 2.78417 24.4359C4.11475 25.1864 5.43395 25.9598 6.75315 26.7331C7.08295 26.9264 7.17393 26.8241 7.17393 26.4715C7.15118 25.5959 7.16255 24.7316 7.16255 23.8672ZM13.0535 16.4183C12.9739 16.3728 12.8943 16.3046 12.7919 16.2477C11.2907 15.3834 9.77821 14.5191 8.28842 13.6434C7.99274 13.4729 7.76529 13.4615 7.46961 13.6434C5.97982 14.5305 4.46729 15.3834 2.96613 16.2477C2.71594 16.3956 2.57947 16.4752 2.93201 16.6799C4.47866 17.5556 6.00257 18.4426 7.53784 19.341C7.75392 19.4661 7.94725 19.5116 8.1747 19.3751C9.73272 18.4767 11.2794 17.5897 12.8374 16.6913C12.9284 16.6344 13.0421 16.5889 13.0535 16.4183ZM16.1695 16.4638C17.9322 17.4759 19.5926 18.4312 21.253 19.3979C21.4122 19.4889 21.5828 19.4775 21.742 19.3865C23.3114 18.4881 24.8808 17.5783 26.4502 16.6799C26.6435 16.5662 26.7572 16.4524 26.4729 16.2932C24.8808 15.3834 23.3 14.4736 21.7192 13.5525C21.5259 13.4387 21.3781 13.4729 21.1961 13.5752C19.5585 14.5191 17.9322 15.4517 16.1695 16.4638Z"
        fill="#EDEDED"
      />
      <path
        d="M20.7502 5.96699C18.9989 6.97913 17.3612 7.92304 15.7236 8.85558C15.4507 9.01479 15.3824 9.2195 15.3824 9.51518C15.3938 10.6069 15.3824 11.7101 15.3824 12.8018C15.3824 12.9724 15.3824 13.143 15.3711 13.3136C15.3256 13.7571 15.0754 14.0187 14.6319 14.0187C14.177 14.0187 13.9495 13.723 13.9495 13.2795C13.9381 12.074 13.9268 10.8685 13.9495 9.65165C13.9609 9.24224 13.8244 9.00342 13.4605 8.79872C11.9821 7.96853 10.515 7.1156 9.048 6.2513C8.64997 6.01248 8.57036 6.1262 8.57036 6.53561C8.58173 7.42266 8.58173 8.3097 8.57036 9.19675C8.57036 9.76537 8.30879 10.0838 7.8539 10.1065C7.42175 10.1179 7.13744 9.78812 7.13744 9.20813C7.12606 8.11637 7.12606 7.01325 7.13744 5.9215C7.14881 4.9321 7.56959 4.10191 8.39977 3.56741C9.98054 2.54389 11.6295 1.62272 13.2899 0.724304C14.0746 0.303524 14.9503 0.223917 15.7464 0.621952C17.5887 1.54312 19.3855 2.54389 21.0686 3.71525C21.7851 4.21564 22.1263 4.97759 22.149 5.86464C22.1718 6.97913 22.1604 8.09363 22.1604 9.20813C22.1604 9.77675 21.8875 10.0952 21.4326 10.0952C21.0004 10.1065 20.7388 9.76537 20.7275 9.18538C20.7502 8.15049 20.7502 7.1156 20.7502 5.96699ZM19.9883 4.6819C18.2597 3.76074 16.7358 2.71448 15.064 1.94115C14.6773 1.75919 14.2679 1.87292 13.9268 2.06625C12.5166 2.86232 11.1178 3.68113 9.71897 4.48857C9.43466 4.64779 9.45741 4.75014 9.73035 4.89798C11.2656 5.77366 12.8009 6.67208 14.3248 7.55913C14.5523 7.69559 14.7683 7.72971 15.0185 7.58187C16.6107 6.63796 18.2255 5.70542 19.9883 4.6819Z"
        fill="#EDEDED"
      />
    </svg>
  );
};

export default PipelineIcon;

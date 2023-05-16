import { Delete, Stop } from "../Icon";

type ServicesCard = {
  title: string;
  className: string;
  icon: string;
};

const ServicesCard = ({ title, className, icon }: ServicesCard) => {
  return (
    <div className={className}>
      <div className="flex gap-8 items-start flex-wrap w-full">
        <div className="dashboard-bottom__card-box">
          <img src={icon} alt="icon" />
        </div>
        <div className="flex gap-4 xl:ml-auto">
          <button className="border-[0.5px] border-brightgray rounded-[3px] py-1 px-3 text-[10px] font-proximaNova-regular">
            Running
          </button>
          <button>
            <Stop />
            {/* <Play /> */}
          </button>
          <button>
            <Delete />
          </button>
        </div>
      </div>
      <h3>{title}</h3>
    </div>
  );
};

export default ServicesCard;

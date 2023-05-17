import React from "react";

type AppCard = {
  title: string;
  className: string;
  icon: string;
};

const AppCard = ({ title, className, icon }: AppCard) => {
  return (
    <div className={className}>
      <div className="dashboard-bottom__card-box">
        <img src={icon} alt="icon" className="rounded-[11px] w-[54px] h-[54px]"/>
      </div>
      <h3>{title}</h3>
    </div>
  );
};

export default AppCard;

import React from "react";

type AppCard = {
  title: string;
  children: React.ReactNode;
  className: string;
  icon: string;
};

const AppCard = ({ title, children, className, icon }: AppCard) => {
  return (
    <div className={className}>
      <div className="dashboard-bottom__card-box">
        <img src={icon} alt="icon" />
      </div>
      <h3>{title}</h3>
      {children}
    </div>
  );
};

export default AppCard;

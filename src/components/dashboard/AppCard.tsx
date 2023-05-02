import React from "react";

type AppCard = {
  title: string;
  description: string;
  children: React.ReactNode;
  className: string;
  icon: string;
};

const AppCard = ({ title, description, children, className, icon }: AppCard) => {
  return (
    <div className={className}>
      <div className="dashboard-bottom__card-box">
        <img src={icon} alt="icon"/>
      </div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
};

export default AppCard;

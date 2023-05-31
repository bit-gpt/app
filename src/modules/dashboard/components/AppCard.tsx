import { AppCardProps } from "../types";

const AppCard = ({ title, className, icon }: AppCardProps) => {
  return (
    <div className={className}>
      <div className="dashboard-bottom__card-box">
        <img src={icon} alt="icon" />
      </div>
      <h3>{title}</h3>
    </div>
  );
};

export default AppCard;

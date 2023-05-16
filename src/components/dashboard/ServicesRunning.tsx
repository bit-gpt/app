import chatLogo from "../../assets/images/chat.svg";
import ServicesCard from "../../shared/components/ServicesCard";

const ServicesRunning = () => {
  return (
    <>
      <div className="mask-heading mb-[29px]">
        <h2>Services Running</h2>
      </div>
      <ServicesCard
        icon={chatLogo}
        className="dashboard-bottom__card flex-wrap !pr-5 services-running"
        title="Vicuna 7B 4-Bit"
      />
    </>
  );
};

export default ServicesRunning;

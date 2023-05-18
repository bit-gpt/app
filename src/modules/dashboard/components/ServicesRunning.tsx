import ServicesCard from "shared/components/ServicesCard";
import chatLogo from "assets/images/chat.svg";

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
        isRunning={true}
        onDelete={() => console.log("onDelete")}
        onStart={() => console.log("onStart")}
        onStop={() => console.log("onStop")}
      />
    </>
  );
};

export default ServicesRunning;

import ServicesCard from "modules/service/components/ServiceCard";
import chatLogo from "assets/images/chat.svg";
import useServices from "shared/hooks/useServices";

const ServicesRunning = () => {
  const { data: response, isLoading } = useServices();

  const services = response?.data || [];

  const runningServices = services.filter((service) => service.running);

  return (
    <>
      <div className="mask-heading mb-[29px]">
        <h2>Services Running</h2>
      </div>
      {isLoading && (
        <div className="flex">
          <label className="text-[#8C8C8C]">Loading ..</label>
        </div>
      )}
      <div className="flex gap-8 flex-wrap">
        {runningServices.map((service) => (
          <ServicesCard
            key={service.id}
            icon={chatLogo}
            className="dashboard-bottom__card flex-wrap !pr-5 services-running"
            title={service.name}
            status="running"
            serviceId={service.id}
          />
        ))}
      </div>
      {!isLoading && runningServices.length === 0 && (
        <div className="text-[#8C8C8C]">No services found</div>
      )}
    </>
  );
};

export default ServicesRunning;

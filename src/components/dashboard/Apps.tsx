import AppCard from "./AppCard";
import chatLogo from "../../assets/images/chat.svg";
import { useQuery } from "@tanstack/react-query";
import { fetchApps } from "../../shared/api";
import { App } from "../../shared/types";
const Apps = () => {
  const { data: response } = useQuery(["getApps"], fetchApps);
  const apps: App[] = response?.data || [];
  
  return (
    <>
      <div className="mask-heading mb-[49px]">
        <h2>Apps</h2>
      </div>
      <div className="dashboard-bottom">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            icon={chatLogo}
            className="dashboard-bottom__card"
            title={app.name}
          />
        ))}
      </div>
    </>
  );
};

export default Apps;

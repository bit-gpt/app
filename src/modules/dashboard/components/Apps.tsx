import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "shared/helpers/utils";
import AppCard from "./AppCard";
import { getApps } from "../api";

const Apps = () => {
  const { data: response } = useQuery(["getApps"], getApps);
  const apps = response?.data || [];

  return (
    <>
      <div className="mask-heading mb-[49px]">
        <h2>Apps</h2>
      </div>
      <div className="dashboard-bottom">
        {apps.map((app) => (
          <AppCard
            key={app.id}
            icon={`${BACKEND_URL}${app.icon}`}
            className="dashboard-bottom__card"
            title={app.name}
          />
        ))}
      </div>
    </>
  );
};

export default Apps;

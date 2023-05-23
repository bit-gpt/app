import { useQuery } from "@tanstack/react-query";
import { BACKEND_URL } from "shared/helpers/utils";
import AppCard from "./AppCard";
import { getApps } from "../api";
import { Link } from "react-router-dom";

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
          <Link to={`/${app.id}/services`} key={app.id}>
            <AppCard
              icon={`${BACKEND_URL}${app.icon}`}
              className="dashboard-bottom__card"
              title={app.name}
            />
          </Link>
        ))}
      </div>
    </>
  );
};

export default Apps;

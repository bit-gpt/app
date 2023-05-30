import { BACKEND_URL } from "shared/helpers/utils";
import AppCard from "./AppCard";
import { Link } from "react-router-dom";
import useApps from "shared/hooks/useInterfaces";

const Apps = () => {
  const { data: response, isLoading } = useApps();
  const apps = response?.data || [];

  return (
    <>
      <div className="mask-heading mb-[49px]">
        <h2 className="!mt-5">Apps</h2>
      </div>
      {isLoading && (
        <div className="flex">
          <label className="text-[#8C8C8C]">Loading ...</label>
        </div>
      )}
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
      {!isLoading && apps.length === 0 && (
        <div className="text-[#8C8C8C]">No apps found</div>
      )}
    </>
  );
};

export default Apps;

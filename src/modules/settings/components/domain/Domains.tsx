import Plus from "assets/images/plus.svg";
import { useEffect, useState } from "react";

import apiDnsd from "../../../../shared/api/dnsd";

import AddDomainModal from "./AddDomainModal";
import ManualDomainModal from "./ManualDomainModal";

const Domains = () => {
  const [isAddDomainModalOpen, setIsAddDomainModalOpen] = useState(false);
  const [isManualDomainModalOpen, setIsManualDomainModalOpen] = useState(false);
  const [domains, setDomains] = useState([]);

  useEffect(() => {
    (async () => {
      const dnsInfo = await apiDnsd().get("dns/existing");
      setDomains(dnsInfo.data.map((dnsInfo: { domain: any }) => dnsInfo.domain));
    })();
  }, []);
  return (
    <>
      <div className="flex items-baseline mt-10 mb-4">
        <label className="text-grey-300 mr-2 backend-url md:text-lg mt-2">Domains</label>
        <div className="text-left flex w-full">
          <button className="text-white" onClick={() => setIsAddDomainModalOpen(true)}>
            <img src={Plus} alt="plus" />
          </button>
        </div>
      </div>

      {domains.length === 0 ? (
        <div className="text-white opacity-70">No Domains Connected Yet</div>
      ) : (
        <>
          {domains.map((domain) => (
            <div
              key={domain}
              className="flex items-center justify-between py-2 px-4 bg-grey-800 rounded-lg mb-2"
            >
              <div className="text-white">{domain}</div>
            </div>
          ))}
        </>
      )}
      <AddDomainModal
        isOpen={isAddDomainModalOpen}
        setIsAddDomainModalOpen={setIsAddDomainModalOpen}
        setIsManualDomainModalOpen={setIsManualDomainModalOpen}
      />
      <ManualDomainModal
        isOpen={isManualDomainModalOpen}
        setIsManualDomainModalOpen={setIsManualDomainModalOpen}
      />
    </>
  );
};

export default Domains;

import Plus from "assets/images/plus.svg";
import { useState } from "react";

import AddDomainModal from "./AddDomainModal";
import ManualDomainModal from "./ManualDomainModal";

const Domains = () => {
  const [isAddDomainModalOpen, setIsAddDomainModalOpen] = useState(false);
  const [isManualDomainModalOpen, setIsManualDomainModalOpen] = useState(false);

  return (
    <>
      <div className="flex items-baseline mt-10">
        <label className="text-white mr-2 backend-url md:text-lg text-[11px] mt-2">Domains</label>
        <div className="text-left flex w-full">
          <button className="text-white" onClick={() => setIsAddDomainModalOpen(true)}>
            <img src={Plus} alt="plus" />
          </button>
        </div>
      </div>
      <div className="text-white">No Domains Connected Yet</div>
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

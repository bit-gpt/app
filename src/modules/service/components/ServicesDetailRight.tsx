const ServicesDetailRight = () => {
  return (
    <div className="w-full">
      <ul className="grid xl:grid-cols-3 items-end gap-4 right-top-card card !ml-0 p-5">
        <li>
          <p>Used Memory/Memory Limit</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0">30%</p>
            <div className="progress">
              <div
                className="progress-container"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
        </li>
        <li>
          <p>Used CPU</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0">30%</p>
            <div className="progress">
              <div
                className="progress-container"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
        </li>
        <li>
          <p>Network IO</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0">30%</p>
            <div className="progress">
              <div
                className="progress-container"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
        </li>
      </ul>
      <div className="card px-[22px] py-8 mt-4">
        <h3 className="text-brightgray font-bold text-xl mb-6">General</h3>
        <div className="right-general-card">
          <span className="opacity-70">Docker Image</span>
          <span>ghcr.io/premai-io/prem-chat-vicuna-7b-q4-m1</span>
        </div>
        <div className="right-general-card">
          <span className="opacity-70">Default Port</span>
          <span>8001</span>
        </div>
        <div className="right-general-card">
          <span className="opacity-70">Memory Requirements</span>
          <span>16GB</span>
        </div>

        <h3 className="text-brightgray font-bold text-xl my-6">Model Info</h3>
        <div className="right-general-card">
          <span className="opacity-70">Weights Size</span>
          <span>4212859520</span>
        </div>
        <div className="right-general-card">
          <span className="opacity-70">Devices</span>
          <span>m1</span>
        </div>
        <div className="right-general-card">
          <span className="opacity-70">Inference Time</span>
          <span>16GB</span>
        </div>
      </div>
      <div className="card px-[38px] py-8 mt-4">
        <h3 className="text-brightgray font-bold text-xl mb-6">Description</h3>
        <p className="text-brightgray text-sm font-proximaNova-regular">A liquidity provider holds Liquid reserves of both a BASE_ASSEST-QUOTE_ASSET IN HIS non-custodial Liquid hot-wallet, running automated market-making strategies, either with or without an oracle. </p>
      </div>
    </div>
  );
};

export default ServicesDetailRight;

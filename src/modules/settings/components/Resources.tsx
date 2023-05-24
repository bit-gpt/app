const Resources = () => {
  const Icon = () => {
    return (
      <svg
        width="9"
        height="9"
        viewBox="0 0 9 9"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M5.04038 3.04917C5.04038 3.14689 5.0114 3.24241 4.95711 3.32366C4.90282 3.40491 4.82566 3.46824 4.73538 3.50563C4.6451 3.54303 4.54576 3.55281 4.44992 3.53375C4.35408 3.51468 4.26604 3.46763 4.19695 3.39853C4.12785 3.32944 4.08079 3.2414 4.06173 3.14556C4.04267 3.04972 4.05245 2.95038 4.08985 2.8601C4.12724 2.76982 4.19057 2.69266 4.27182 2.63837C4.35307 2.58408 4.44859 2.5551 4.54631 2.5551C4.67734 2.5551 4.80301 2.60716 4.89567 2.69981C4.98832 2.79247 5.04038 2.91814 5.04038 3.04917ZM8.49886 4.86076C8.49886 4.07902 8.26705 3.31483 7.83274 2.66484C7.39842 2.01484 6.78112 1.50823 6.05888 1.20908C5.33665 0.909916 4.54192 0.831642 3.7752 0.984152C3.00848 1.13666 2.3042 1.51311 1.75143 2.06588C1.19865 2.61866 0.822209 3.32293 0.669699 4.08965C0.517189 4.85638 0.595463 5.6511 0.894622 6.37334C1.19378 7.09557 1.70039 7.71288 2.35038 8.14719C3.00038 8.5815 3.76457 8.81331 4.54631 8.81331H8.49886V4.86076ZM7.8401 4.86076V8.15456H4.54631C3.89486 8.15456 3.25803 7.96138 2.71637 7.59945C2.17471 7.23752 1.75254 6.7231 1.50324 6.12124C1.25394 5.51938 1.18871 4.85711 1.3158 4.21817C1.44289 3.57924 1.7566 2.99234 2.21724 2.53169C2.67789 2.07105 3.26479 1.75735 3.90372 1.63025C4.54265 1.50316 5.20493 1.56839 5.80679 1.81769C6.40865 2.06699 6.92307 2.48916 7.285 3.03082C7.64692 3.57249 7.8401 4.20931 7.8401 4.86076ZM5.20507 4.86076C5.20507 4.68605 5.13566 4.51849 5.01212 4.39495C4.88858 4.27141 4.72102 4.202 4.54631 4.202H3.88755V4.86076H4.54631V7.16642H5.20507V4.86076Z"
          fill="#F9B96D"
        />
      </svg>
    );
  };
  return (
    <div className="settings-card">
      <h3>Resources</h3>
      <ul className="flex items-end max-lg:flex-wrap gap-6">
        <li>
          <div className="flex flex-wrap justify-between">
            <span className="flex items-center">
              Memory&nbsp;
              <Icon />{" "}
            </span>
            <span>6/1024 MB</span>
          </div>
          <div className="progress">
            <div className="progress-container" style={{ width: "14%" }}></div>
          </div>
        </li>
        <li>
          <div className="flex flex-wrap justify-between">
            <span className="flex items-center">
              CPU&nbsp;
              <Icon />{" "}
            </span>
            <span>3% of 0.5 vCPUs</span>
          </div>
          <div className="progress">
            <div className="progress-container" style={{ width: "30%" }}></div>
          </div>
        </li>
        <li>
          <div className="flex flex-wrap justify-between">
            <span className="flex items-center">
              Storage&nbsp;
              <Icon />{" "}
            </span>
            <span>137/1,024 MB</span>
          </div>
          <div className="progress">
            <div className="progress-container" style={{ width: "20%" }}></div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default Resources;

const RightSidebar = () => {
  return (
    <div className="w-full">
      <ul className="grid grid-cols-3 items-end gap-4 right-top-card card p-5">
        <li>
          <p>Used Memory/Memory Limit</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0">30%</p>
            <div className="progress">
              <div className="progress-container" style={{ width: "30%" }}></div>
            </div>
          </div>
        </li>
        <li>
          <p>Used CPU</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0">30%</p>
            <div className="progress">
              <div className="progress-container" style={{ width: "30%" }}></div>
            </div>
          </div>
        </li>
        <li>
          <p>Network IO</p>
          <div className="flex gap-[6px] items-center">
            <p className="!mb-0">30%</p>
            <div className="progress">
              <div className="progress-container" style={{ width: "30%" }}></div>
            </div>
          </div>
        </li>
      </ul>
    </div>
  );
};

export default RightSidebar;

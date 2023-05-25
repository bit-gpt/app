const SettingsForm = () => {
  return (
    <div className="lg:mt-[83px] mt-[43px]">
      <div className="grid lg:grid-cols-2 mb-9">
        <label className="form-label">Name</label>
        <input className="form-control" placeholder="Lorem Ipsum" readOnly/>
      </div>
      <div className="grid lg:grid-cols-2 mb-9">
        <label className="form-label">Version / Tag</label>
        <div className="flex gap-1">
          <div className="select-control pointer-events-none select-none">
            <select className="form-control">
              <option value="1">1.21.2</option>
            </select>
          </div>
          <input
            className="form-control"
            placeholder="Custom Version"
            readOnly
          />
        </div>
      </div>
      <div className="grid lg:grid-cols-2 mb-9">
        <label className="form-label w-full">Destination</label>
        <div className="select-control">
          <select className="form-control pointer-events-none select-none">
            <option value="docker">Local Docker</option>
          </select>
        </div>
      </div>
      <div className="grid lg:grid-cols-2 mb-9">
        <label className="form-label">URL</label>
        <input readOnly={true} className="form-control" placeholder="https://192.168.1.1" />
      </div>
    </div>
  );
};

export default SettingsForm;

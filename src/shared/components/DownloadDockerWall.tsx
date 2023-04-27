type DownloadDockerWall = {
  handleCheckIsDockerRunning: () => void;
};

const DownloadDockerWall = ({
  handleCheckIsDockerRunning,
}: DownloadDockerWall) => {
  return (
    <div className="container">
      <h1>Docker not Detected</h1>
      <p>
        In order to run Prem App you need to have Docker installed and running.
        If you don't have Docker Desktop installed, you can go to the link
        below.
      </p>
      <div className="row">
        <a
          href="https://www.docker.com/products/docker-desktop/"
          target="_blank"
        >
          Download Docker Desktop
        </a>
      </div>
      <div className="row">
        <h3>Dependencies</h3>
      </div>
      <div className="row">
        <p>Docker</p>
      </div>
      <button onClick={(e) => handleCheckIsDockerRunning()}>Check Again</button>
    </div>
  );
};

export default DownloadDockerWall;

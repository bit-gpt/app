const PetalsBanner = () => {
  return (
    <div className="flex items-center bg-primary p-4">
      <p className="z-10">
        Feeling slow with the Public Network?{" "}
        <a
          href="mailto:hello@premai.io"
          target="_blank"
          rel="noreferrer"
          className="underline font-bold"
        >
          Get in Touch
        </a>{" "}
        for the Pro Plan!
      </p>
    </div>
  );
};

export default PetalsBanner;

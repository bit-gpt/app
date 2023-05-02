type RegenerateButton = {
  onRgenerateClick: () => void;
};

const RegenerateButton = ({ onRgenerateClick }: RegenerateButton) => {
  return <button onClick={onRgenerateClick}>Regenerate</button>;
};

export default RegenerateButton;

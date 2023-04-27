type AppCard = {
  title: string;
  description: string;
};

const AppCard = ({ title, description }: AppCard) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      <button> Download </button>
    </div>
  );
};

export default AppCard;

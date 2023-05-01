type AppCard = {
  title: string;
  description: string;
  children: React.ReactNode;
};

const AppCard = ({ title, description, children }: AppCard) => {
  return (
    <div>
      <h3>{title}</h3>
      <p>{description}</p>
      {children}
    </div>
  );
};

export default AppCard;

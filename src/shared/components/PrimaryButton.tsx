const PrimaryButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={`btn-primary ${className || ""}`} {...props}>
      {children}
    </button>
  );
};

export default PrimaryButton;

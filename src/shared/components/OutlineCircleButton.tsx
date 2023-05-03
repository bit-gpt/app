const OutlineCircleButton = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <button className={`btn-outline-circle ${className || ""}`} {...props}>
      {children}
    </button>
  );
};

export default OutlineCircleButton;

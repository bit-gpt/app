const TagsOutline = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <span className={`border text-brightgray ${className || ""}`} {...props}>
      {children}
    </span>
  );
};

export default TagsOutline;

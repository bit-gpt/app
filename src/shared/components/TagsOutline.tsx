const TagsOutline = ({
  children,
  className,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement>) => {
  return (
    <span className={`border text-grey-300 ${className || ""}`} {...props}>
      {children}
    </span>
  );
};

export default TagsOutline;

export const TabDescription = ({
  description,
  className,
}: {
  description: string;
  className?: string;
}) => {
  return <p className={`text-[#71717A] text-sm ${className}`}>{description}</p>;
};

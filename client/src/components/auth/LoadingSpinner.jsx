const LoadingSpinner = ({ size = "sm" }) => {
  const sizeClass = size === "lg" ? "h-6 w-6 border-4" : "h-4 w-4 border-2";
  return <span className={`inline-block animate-spin rounded-full border-white border-t-transparent ${sizeClass}`} />;
};

export default LoadingSpinner;

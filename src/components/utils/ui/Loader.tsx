interface LoaderProps {
  isLoading: boolean;
}

const Loader: React.FC<LoaderProps> = ({ isLoading }) => {
  if (isLoading) {
    return (
      <div className="w-full h-full flex justify-center items-center flex-col gap-10 my-10">
        <div className="relative h-[150px] w-[150px]">
          <div className="absolute inset-0 rounded-full border-4 border-t-[#006BE4] border-r-transparent border-b-transparent border-l-transparent animate-spin"></div>
          <div className="absolute inset-2 rounded-full border-4 border-t-transparent border-r-[#006BE4] border-b-transparent border-l-transparent animate-spin animation-delay-150"></div>
          <div className="absolute inset-4 rounded-full border-4 border-t-transparent border-r-transparent border-b-[#006BE4] border-l-transparent animate-spin animation-delay-300"></div>
          <div className="absolute inset-6 rounded-full border-4 border-t-transparent border-r-transparent border-b-transparent border-l-[#006BE4] animate-spin animation-delay-450"></div>
        </div>
        <p className="text-center">Loading...</p>
      </div>
    );
  }
  return null;
};

export default Loader;

import React from "react";
import Lottie from "lottie-react";
import filmLoadingAnimation from "../../assets/animations/Gibli_loading.json";
const LoadingOverlay = () => {
  return (
    <div className="fixed inset-0 bg-gray-950 flex justify-center items-center z-200">
      <div className="flex flex-col-reverse items-center justify-center gap-8">
        <Lottie
          animationData={filmLoadingAnimation}
          loop={true}
          className="w-64 h-64 "
        />
      </div>
    </div>
  );
};

export default LoadingOverlay;

import Lottie from "lottie-react";
import loaderAnimation from "../assets/loader.json";

export const LoaderScreen = () => {
  return (
    <div className="w-screen h-screen bg-zinc-950 flex justify-center items-center overflow-hidden">
      <Lottie animationData={loaderAnimation} loop className="w-96"/>
    </div>
  )
}


export default LoaderScreen

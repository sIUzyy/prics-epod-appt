// react-router-dom
import { Link } from "react-router";

// image
import truck_img from "../../assets/truck_image.webp";

export default function LandingPageComponent() {
  return (
    <div className="min-h-screen px-5 flex flex-col justify-center items-center py-10 md:flex md:flex-row md:min-h-0  lg:mx-auto lg:max-w-4xl lg:px-0 xl:max-w-6xl ">
      <div className="heading_content text-center  md:text-left xl:w-1/2  ">
        <h1 className="font-bebas text-4xl mb-5 tracking-wider text-[#2A2A72] md:max-w-[350px] lg:max-w-[430px] lg:text-5xl xl:max-w-[550px] ">
          streamline your delivery process with{" "}
          <span className="bg-gradient-to-r from-[#4A90E2] to-[#9013FE] text-transparent bg-clip-text">
            electronic proof of delivery
          </span>
        </h1>

        {/* get started button */}
        <Link to={"/signin"}>
          <h1 className="mx-auto font-bebas tracking-widest text-white px-5 py-1 rounded-full w-fit text-sm bg-gradient-to-r from-[#4A90E2] to-[#9013FE] shadow-lg hover:opacity-80 transition md:mx-0 lg:text-base 2xl:text-lg">
            get started
          </h1>
        </Link>
      </div>

      <div className="image_content mt-5  md:mt-0 xl:w-1/2 ">
        <img
          src={truck_img}
          alt="truck_image"
          className="object-cover h-90 lg:w-[50vh] xl:mx-auto"
          loading="lazy"
        />
      </div>
    </div>
  );
}

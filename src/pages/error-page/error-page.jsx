import error_img from "../../assets/error_image.webp"; // image
import { Link } from "react-router"; // react-router-dom

// if there's non-existence route, show this.
export default function ErrorPage() {
  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <div className="text-center px-5">
        <img src={error_img} alt="error-image" />
        <h1 className="font-bebas text-3xl tracking-wider">PAGE NOT FOUND</h1>
        <p className="text-sm">
          {" "}
          The page you’re looking for doesn’t exist or may have been moved.
        </p>
        <Link to={"/"}>
          <h1 className="bg-gradient-to-r from-[#4A90E2] to-[#9013FE] mt-5 rounded-full text-white font-inter w-fit mx-auto px-5 py-1 flex items-center">
            Return to Home Page
          </h1>
        </Link>
      </div>
    </div>
  );
}

// props validation
import PropTypes from "prop-types";

export default function AboutCard({ title, description, style }) {
  return (
    <div className={`${style}`}>
      <div className="title md:w-1/2">
        <h1 className="font-bebas text-4xl tracking-wider text-black">
          {title}
        </h1>
      </div>

      <div className="description  md:w-1/2">
        <p>{description}</p>
      </div>
    </div>
  );
}

// Prop validation
AboutCard.propTypes = {
  title: PropTypes.string.isRequired, // Ensures title is a string
  description: PropTypes.string.isRequired, // Ensures description is a string
  style: {},
};

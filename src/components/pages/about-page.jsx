// NOTE: THIS IS ABOUT PAGE COMPONENT THIS WILL DISPLAY ON LANDING PAGE

// props-validation
import PropTypes from "prop-types";

// components - card
import AboutCard from "../card/about-card";

export default function AboutPageComponent({ aboutRef }) {
  return (
    <div
      ref={aboutRef}
      className="py-10 px-5 lg:mx-auto lg:max-w-4xl xl:max-w-6xl  lg:px-0"
    >
      <AboutCard
        style={"md:flex"}
        title={"PRICS TEAM"}
        description={` A group of young, proactive and highly experienced individuals, with
            different expertise in their respective fields, joined together and
            established PRICS Technologies with a common goal of sharing their
            vast knowledge and experiences in helping companies grow their
            business. PRICS Team who is composed of Supply Chain, Information
            Technology, Sales & Marketing and Finance Practitioners, thinks for
            out of the box solutions and offers the latest best practices, thus
            removing the limitations companies are getting from the traditional
            software offered in the market.`}
      />

      <AboutCard
        style={"my-10 md:flex"}
        title={"our mission"}
        description={`PRICS Team mission is to enable our clients to fully execute their
            business strategy through People, Process and Technology. Help them
            confidently address technology-related decisions and ensure their IT
            organizations and operating models are agile and effective,
            equipping them to cut through the noise of fleeting technology
            trends to create enduring results.`}
      />

      <AboutCard
        style={"my-10 md:flex"}
        title={"our vision"}
        description={`PRICS Team vision is for its solutions and services focuses on the
            strategic needs of our clients businesses to determine the
            technology capabilities needed to support their long-term goals and
            not constrain it.`}
      />
    </div>
  );
}

// props validation
AboutPageComponent.propTypes = {
  aboutRef: PropTypes.shape({ current: PropTypes.instanceOf(Element) }),
};

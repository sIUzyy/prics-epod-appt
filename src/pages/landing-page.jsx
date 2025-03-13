// react
import React, { useRef } from "react";

// component - header
import NavigationBar from "@/components/header/navigation-bar";
import Footer from "@/components/header/footer";

// component - pages
import LandingPageComponent from "@/components/pages/landing-page";
import AboutPageComponent from "@/components/pages/about-page";

export default function LandingPage() {
  // ref to scroll down to specific page
  const aboutRef = useRef(null);
  const contactRef = useRef(null);

  return (
    <React.Fragment>
      {/* Navigation Bar */}
      <NavigationBar aboutRef={aboutRef} contactRef={contactRef} />

      {/* Landing Page */}
      <LandingPageComponent />

      {/* About Page */}
      <AboutPageComponent aboutRef={aboutRef} />

      {/* Footer Page */}
      <Footer contactRef={contactRef} />
    </React.Fragment>
  );
}

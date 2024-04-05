import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 px-8 sm:px-20 py-3 pb-10">

      <div className="flex justify-center w-full mt-5">
        <p className="pr-4">© 2024 GoPhotos, Inc.</p>
        <span className="mx-2">•</span>
        <a href="/Terms-of-Service.pdf" target="_blank" className="pr-4 hover-gradient">
          Terms of Service
        </a>
        <span className="mx-2">•</span>
        <a href="/Privacy-Policy.pdf" target="_blank" className="pr-4 hover-gradient">
          Privacy Policy
        </a>
        <span className="mx-2">•</span>
        <a href="http://tinyurl.com/GP-Photographer" className="pr-4 hover-gradient">
          Become a Photographer
        </a>
        <span className="mx-2">•</span>
        <a href="mailto:hello@gophotos.us" className="hover-gradient">
          Contact Us
        </a>
      </div>
    </footer>
  );
};

export default Footer;

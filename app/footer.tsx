import React from "react";

const Footer = () => {
  return (
    <footer className="border-t border-gray-300 px-8 sm:px-20 py-3 pb-10">
      {/* <div className="p-5">
        <h3 className="text-lg font-semibold flex justify-center">
          Didn't find the photographer you're looking for?
        </h3>
        <div className="flex justify-center">
          <p className="flex justify-center">
            New photographers join weekly. Subscribe to our newsletter for
            updates.
          </p>
        </div>
        <form className="mt-4 flex justify-center items-center">
          <input
            id="email"
            type="email"
            placeholder="Your email"
            className="border p-2 mr-2 mb-0 h-9 rounded-md"
            required
          />
          <button
            type="submit"
            className="bg-gradient-to-r from-[#FF9993] via-[#FC7674] to-[#FC4D74] text-white p-2 px-4 rounded-md h-9 items-center justify-center flex"
          >
            Sign Up
          </button>
        </form>
      </div> */}

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
        <a href="mailto:hello@gophotos.us" className="hover-gradient">
          Contact Us
        </a>
      </div>
    </footer>
  );
};

export default Footer;

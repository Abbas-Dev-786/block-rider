import { NavLink } from "react-router-dom";

const Footer = () => {
  return (
    <div className="w-screen bg-black flex flex-col items-center justify-center  bg-section_bg text-white  py-[50px] px-4  font_tomato_grotesk z-[3] ">
      <NavLink to="/" className="flex items-center">
        <p className="text-2xl font-bold text-white">Block Ride</p>
      </NavLink>
      <p className="text-xl text-center px-4 my-1">
        Made with ❤ by Abbas Bhanpura wala
      </p>
      <ul className="flex h-[46px] gap-4  text-[12px] space-x-1 opacity-90 text-neutral-400  lg:gap-6  lg:text-base lg:space-x-2 vvvs:text-[8px] vvvs:gap-2 z-[2]">
        <a
          className="hover:text-white"
          href="https://github.com/Abbas-Dev-786"
          target="_blank"
        >
          Github
        </a>
        <li>|</li>
        <a
          className="hover:text-white"
          href="https://www.linkedin.com/in/abbas-bhanpura-wala-81b193231"
          target="_blank"
        >
          Linkedin
        </a>
        <li>|</li>
        <a
          className="hover:text-white"
          href="https://www.instagram.com/abbas_bhanpura_wala/"
          target="_blank"
        >
          Instagram
        </a>
        <li>|</li>
        <a
          className="hover:text-white"
          href="mailto:abbasbhanpura.dev@gmail.com"
          target="_blank"
        >
          Mail
        </a>
      </ul>
      <p className="text-[10px] opacity-30 text-center px-4 lg:text-[12px]">
        © All rights reserved by Abbas ✦ Abbas Bhanpura wala
      </p>
    </div>
  );
};

export default Footer;

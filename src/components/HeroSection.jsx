import PropTypes from "prop-types";

const HeroSection = ({
  heading,
  paras,
  linkBar = "",
  picture,
  TrowRev,
  button,
  TspecialCaseWMB = "",
}) => {
  return (
    <div
      className={`container-lg text-black flex ${
        TrowRev && "md:flex-row-reverse"
      } flex-col items-center justify-center gap-10 py-6 px-4 md:py-10 md:flex-row md:gap-32 md:px-10`}
    >
      <div className="flex items-center justify-center">
        <img alt="company-logo" width={552} height={552} src={picture} />
      </div>
      <div className="w-full md:w-[454px]">
        <div className="">
          <h1 className="text-[34px] md:text-[45px] lg:text-[52px] font-bold leading-tight">
            {heading}
          </h1>
          <p className="flex text-[19px] md:text-[23px] mb-[10px]  space_grotesk ">
            {paras}
          </p>
        </div>

        <div className="flex gap-x-7 h-fit items-center mt-7">
          <div
            className={`${TspecialCaseWMB} h-[48px]  bg-black rounded-md flex justify-center items-center hover:bg-GG duration-200`}
          >
            <a href="/" className="text-white h-fit font-medium">
              {button}
            </a>
          </div>

          {linkBar && (
            <div className="items-end h-fit">
              <span className="text-black cursor-pointer">
                {linkBar}
                <div className="w-30 h-1 bg-gray-200 rounded-3xl"></div>
                <div className="w-30 h-1 rounded-3xl hover:{before:bg-grey-200 after:bg-black}"></div>
              </span>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HeroSection;

HeroSection.propTypes = {
  heading: PropTypes.string,
  paras: PropTypes.string,
  linkBar: PropTypes.string,
  picture: PropTypes.string,
  TrowRev: PropTypes.bool,
  button: PropTypes.string,
  TspecialCaseWMB: PropTypes.string,
};

import { blocksData } from "../data/data";
import HeroSection from "../components/HeroSection";
import Banner from "../components/Banner";

const HomePage = () => {
  return (
    <>
      <Banner />

      <div className="flex my-8 flex-col items-center justify-center gap-16"></div>
      {blocksData.map((block, index) => (
        <HeroSection
          key={index}
          heading={block.heading}
          paras={block.paras}
          linkBar={block.linkBar}
          picture={block.picture}
          TrowRev={block.TrowRev}
          Tfstc={block.Tfstc}
          Theight={block.Theight}
          Tmt={block.Tmt}
          TupperHalf={block.TupperHalf}
          button={block.button}
          TspecialCaseWMB={block.TspecialCaseWMB}
        />
      ))}
    </>
  );
};

export default HomePage;

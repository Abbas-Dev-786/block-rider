import Second from "./../assets/second.webp";
import Third from "./../assets/third.webp";
import Fourth from "./../assets/fourth.webp";
import Fifth from "./../assets/fifth.webp";

import BlackCar from "./../assets/Black_v1.png";
import ComfortCar from "./../assets/UberComfort.png";
import PetCar from "./../assets/UberX_Pet.png";
import V1 from "./../assets/UberX_v1.png";

export const blocksData = [
  {
    heading: "Drive when you want, make what you need",
    paras:
      "Make money on your schedule with deliveries or rides—or both. You can use your own car or choose a rental through Uber.",
    linkBar: "Already have an account? Sign in",
    picture: Second,
    TrowRev: true,
    Tfstc: "text-[52px] text-black",
    Theight: "h-[383px]",
    Tmt: "mt-8",
    TupperHalf: "",
    button: "Get started",
    TspecialCaseWMB: "w-[135px] mt-[0px]",
  },
  {
    heading: "The Uber you know, reimagined for business",
    paras:
      "Uber for Business is a platform for managing global rides and meals, and local deliveries, for companies of any size.",
    linkBar: "Check out our solutions",
    picture: Third,
    TrowRev: false,
    Tfstc: "text-[52px] text-GG",
    Theight: "h-[390px] mb-[-13px]",
    Tmt: "text-GG pt-3 mt-7",
    TupperHalf: "pt-1 mb-3",
    button: "Get started",
    TspecialCaseWMB: "w-[135px]",
  },
  {
    heading: "Make money by renting out your car",
    paras:
      "Connect with thousands of drivers and earn more per week with Uber’s free fleet management tools.",
    linkBar: "",
    picture: Fourth,
    TrowRev: true,
    Tfstc: "text-[36px] text-black",
    Theight: "h-[240px]",
    Tmt: "",
    TupperHalf: "flex flex-col pb-6",
    button: "Get started",
    TspecialCaseWMB: "w-[135px]",
  },
  {
    heading: "Check out what's new at Uber",
    paras:
      "The products and features announced at Go-Get 2024 are designed to help you connect with others and save a little money along the way. Discover how we’re making every journey an opportunity for interaction—because life is better together.",
    linkBar: "",
    picture: Fifth,
    TrowRev: false,
    Tfstc: "text-[52px] text-black",
    Theight: "h-[383px]",
    Tmt: "mt-8",
    TupperHalf: "flex flex-col",
    button: "Watch the event",
    TspecialCaseWMB: "w-[173px] mb-[-10px]",
  },
];

export const CarListData = [
  {
    id: 1,
    name: "Uber X",
    seat: 4,
    desc: "Affordable, Everyday rides",
    amount: 1.1,
    image: V1,
  },
  {
    id: 2,
    name: "Comfort",
    seat: 4,
    desc: "Newer cars with extra legroom",
    amount: 1.6,
    image: ComfortCar,
  },
  {
    id: 4,
    name: "Uber Pet",
    seat: 4,
    desc: "Affordable rides for you and your pet",
    amount: 1.4,
    image: PetCar,
  },
  {
    id: 5,
    name: "Black",
    seat: 4,
    desc: "Affordable, Everyday rides",
    amount: 1.5,
    image: BlackCar,
  },
];

// import { FaUser } from "react-icons/fa6";

function CarListItem({ car, distance }) {
  return (
    <div className="mt-4 p-4">
      <div className="md:flex justify-between sm:flex sm:flex-col">
        <div className="md:flex md:flex-row items-center gap-5 sm:flex sm:flex-col">
          <img src={car.image} width={100} height={100} />
          <div>
            <div className="flex gap-5 break-all md:text-[5px]">
              <h2 className="text-[18px] font-semibold break-all">
                {car.name}
              </h2>
              <span className="flex gap-2 items-center text-[14px] break-all">
                {/* <FaUser /> */}
                {car.seat}
              </span>
            </div>
            <p>{car.desc}</p>
          </div>
        </div>
        <h2 className="md:text-[18px] font-semibold break-all sm:text-[5px]">
          ${(car.amount * distance).toFixed(2)}
        </h2>
      </div>
    </div>
  );
}

export default CarListItem;

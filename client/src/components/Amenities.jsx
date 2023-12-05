import React from "react";
import { iconMap } from "./IconMap.jsx";

const Amenities = ({
  amenities,
  handleAmenitiesChange,
  handleNextStep,
  handlePrevStep,
}) => {
  const formatAmenitiesValues = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1).replace(/_/g, " ");
  };

  // const iconMap = {
  //   wifi: <FaWifi />,
  //   dryer: <BiSolidDryer />,
  //   washer: <BiSolidWasher />,
  //   iron: <MdIron />,
  //   air_conditioner: (
  //     <FontAwesomeIcon icon={faFan} style={{ color: "#000000" }} />
  //   ),
  //   heater: (
  //     <FontAwesomeIcon
  //       icon={faTemperatureArrowUp}
  //       style={{ color: "#000000" }}
  //     />
  //   ),
  //   pool_available: <MdPool />,
  //   grill: <MdOutdoorGrill />,
  //   hot_tub: (
  //     <FontAwesomeIcon icon={faHotTubPerson} style={{ color: "#000000" }} />
  //   ),
  //   free_parking: <FaParking />,
  //   ev_charger: <FaBolt />,
  //   beach_front: <FaUmbrellaBeach />,
  //   water_front: <FaWater />,
  //   mountain_view: <FaMountain />,
  //   city_view: <FaCity />,
  //   gym: <CgGym />,
  //   elevator: <MdElevator />,
  //   wheelchair_accessible: <FaWheelchair />,
  //   pet_friendly: <MdOutlinePets />,
  //   smoking_allowed: <FaSmoking />,
  // };

  //   console.log(amenities, "from amenities");

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mt-4">
        {/* Repeat the following div block for each checkbox */}
        {Object.keys(amenities).map((key) => (
          <div key={key} className="flex items-center mb-4">
            <input
              id={key}
              type="checkbox"
              value={amenities[key]}
              checked={amenities[key]}
              onChange={() => handleAmenitiesChange(key)}
              className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
            />
            <label
              htmlFor={key}
              className="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300"
              i
            >
              <div className="flex items-center justify-center px-2 text-xl">
                <div className="mr-2">{iconMap[key].icon}</div>
                {formatAmenitiesValues(key)}
              </div>
            </label>
          </div>
        ))}
      </div>
      <div className="flex justify-between w-full mt-4">
        <button
          className="flex mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          onClick={handlePrevStep}
        >
          Back
        </button>
        <button
          className="flex mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          onClick={handleNextStep}
        >
          Next
        </button>
      </div>
    </>
  );
};

export default Amenities;

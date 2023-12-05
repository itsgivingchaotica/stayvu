import React from "react";
import { BiSolidWasher, BiSolidDryer } from "react-icons/bi";
import {
  FaWifi,
  FaParking,
  FaUmbrellaBeach,
  FaWater,
  FaMountain,
  FaCity,
  FaWheelchair,
  FaSmoking,
} from "react-icons/fa";
import {
  MdIron,
  MdPool,
  MdOutdoorGrill,
  MdElevator,
  MdOutlinePets,
} from "react-icons/md";
import { FaBolt } from "react-icons/fa6";
import { CgGym } from "react-icons/cg";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faFan,
  faTemperatureArrowUp,
  faHotTubPerson,
} from "@fortawesome/free-solid-svg-icons";

export const iconMap = {
  wifi: { icon: <FaWifi />, name: "Wifi" },
  dryer: { icon: <BiSolidDryer />, name: "Dryer" },
  washer: { icon: <BiSolidWasher />, name: "Washer" },
  iron: { icon: <MdIron />, name: "Iron" },
  air_conditioner: {
    icon: <FontAwesomeIcon icon={faFan} style={{ color: "#000000" }} />,
    name: "Air Conditioner",
  },
  heater: {
    icon: (
      <FontAwesomeIcon
        icon={faTemperatureArrowUp}
        style={{ color: "#000000" }}
      />
    ),
    name: "Heater",
  },
  pool_available: { icon: <MdPool />, name: "Pool Available" },
  grill: { icon: <MdOutdoorGrill />, name: "Grill" },
  hot_tub: {
    icon: (
      <FontAwesomeIcon icon={faHotTubPerson} style={{ color: "#000000" }} />
    ),
    name: "Hot Tub",
  },
  free_parking: { icon: <FaParking />, name: "Free Parking" },
  ev_charger: { icon: <FaBolt />, name: "EV Charger" },
  beach_front: { icon: <FaUmbrellaBeach />, name: "Beach Front" },
  water_front: { icon: <FaWater />, name: "Water Front" },
  mountain_view: { icon: <FaMountain />, name: "Mountain View" },
  city_view: { icon: <FaCity />, name: "City View" },
  gym: { icon: <CgGym />, name: "Gym" },
  elevator: { icon: <MdElevator />, name: "Elevator" },
  wheelchair_accessible: {
    icon: <FaWheelchair />,
    name: "Wheelchair Accessible",
  },
  pet_friendly: { icon: <MdOutlinePets />, name: "Pet Friendly" },
  smoking_allowed: { icon: <FaSmoking />, name: "Smoking Allowed" },
};

import React from "react";
import { useSelector } from "react-redux";
import { iconMap } from "./IconMap.jsx";
import { MdOutlineBedroomParent } from "react-icons/md";
import { FaBed } from "react-icons/fa";
import { RiHomeSmileFill } from "react-icons/ri";
const PropertyConfirmation = ({
  formData,
  imageFiles,
  amenities,
  handleFormSubmit,
  handlePrevStep,
  isEditingProperty,
  handleEditProperty,
}) => {
  const propertyId = useSelector(
    (state) => state.properties?.currentProperty?.id
  );
  const currentProperty = useSelector(
    (state) => state.properties?.currentProperty
  );
  const {
    address1,
    address2,
    city,
    state,
    country,
    zipcode,
    num_beds,
    num_baths,
    num_bedrooms,
    property_type,
  } = formData;
  const {
    wifi,
    dryer,
    washer,
    iron,
    air_conditioner,
    heater,
    pool_available,
    grill,
    hot_tub,
    free_parking,
    ev_charger,
    beach_front,
    water_front,
    mountain_view,
    city_view,
    gym,
    elevator,
    wheelchair_accessible,
    pet_friendly,
    smoking_allowed,
  } = amenities;
  return (
    <div>
      <div className="bg-white p-8 rounded-md ring-2 ring-gray-500 w-full mb-4">
        <div className="text-center mb-6">
          <div className="text-3xl">{address1}</div>
          {address2 ? <div className="text-3xl">{address2}</div> : <></>}
          <div className="text-3xl">
            {city}, {state}, {country}, {zipcode}
          </div>
          <div className="flex items-center text-2xl justify-center">
            <RiHomeSmileFill />
            <div className="ml-4">Property Type: {property_type}</div>
          </div>
        </div>
        <div className="flex">
          <div className="grid-container h-76" style={{ overflowY: "auto" }}>
            <div className="grid gap-4 mb-4 mr-4">
              {imageFiles.map((file, index) => (
                <div style={{ position: "relative" }} key={index}>
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Image ${index + 1}`}
                    className="w-72 h-72 object-cover rounded mb-4"
                  />
                </div>
              ))}
            </div>
          </div>
          <div>
            <div className="flex items-center text-xl">
              <MdOutlineBedroomParent />
              <p className="ml-4">
                {num_bedrooms < 1.5
                  ? `${num_bedrooms} Bedroom`
                  : `${num_bedrooms} Bedrooms`}
              </p>
            </div>
            <div className="flex items-center text-xl">
              <FaBed />
              <p className="ml-4">
                {num_beds < 1.5 ? `${num_beds} Bed` : `${num_beds} Beds`}
              </p>
            </div>
            <div className="flex items-center text-xl">
              <MdOutlineBedroomParent />
              <p className="ml-4">
                {num_baths < 1.5 ? `${num_baths} Bath` : `${num_baths} Baths`}
              </p>
            </div>
            <div className="text-2xl">
              {Object.keys(amenities).map(
                (amenity, index) =>
                  amenities[amenity] && (
                    <div key={index} className="flex items-center text-xl">
                      {iconMap[amenity].icon}
                      <p className="ml-4">{iconMap[amenity].name}</p>
                      {/* Add other content related to the amenity if needed */}
                    </div>
                  )
              )}
            </div>
          </div>
        </div>
        {/* <p>
          Amenities: {wifi}, {dryer}, {washer}, {iron}, {air_conditioner},{" "}
          {heater}, {pool_available}, {grill}, {hot_tub}, {free_parking},{" "}
          {ev_charger}, {beach_front}, {water_front}, {mountain_view},{" "}
          {city_view}, {gym}, {elevator}, {wheelchair_accessible},{" "}
          {pet_friendly}, {smoking_allowed}
        </p> */}
      </div>
      <div className="flex justify-between w-full mt-4">
        <button
          className="flex mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          onClick={handlePrevStep}
        >
          Back
        </button>
        {isEditingProperty && currentProperty ? (
          <button
            className="flex mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            onClick={() => handleEditProperty(propertyId)}
          >
            Confirm Edits
          </button>
        ) : (
          <button
            className="flex mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
            onClick={handleFormSubmit}
          >
            Add Property to Profile
          </button>
        )}
      </div>
    </div>
  );
};

export default PropertyConfirmation;

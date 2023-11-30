import React from "react";

const PropertyConfirmation = ({
  formData,
  imageFiles,
  amenities,
  handleFormSubmit,
  handlePrevStep,
}) => {
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
      <div className="text-center mb-6">
        <div className="text-3xl">{address1}</div>
        {address2 ? <div className="text-3xl">{address2}</div> : <></>}
        <div className="text-3xl">
          {city}, {state}, {country}, {zipcode}
        </div>
      </div>
      <div className="grid grid-cols-3 gap-4">
        {imageFiles.map((file, index) => (
          <div style={{ position: "relative" }} key={index}>
            <img
              src={URL.createObjectURL(file)}
              alt={`Image ${index + 1}`}
              className="w-64 h-64 object-cover rounded"
            />
          </div>
        ))}
      </div>
      <p>Number of Beds: {num_beds}</p>
      <p>Number of Baths: {num_baths}</p>
      <p>Number of Bedrooms: {num_bedrooms}</p>
      <p>Property Type: {property_type}</p>
      <p>
        Amenities: {wifi}, {dryer}, {washer}, {iron}, {air_conditioner},{" "}
        {heater}, {pool_available}, {grill}, {hot_tub}, {free_parking}, {ev_charger},{" "}
        {beach_front}, {water_front}, {mountain_view}, {city_view}, {gym},{" "}
        {elevator}, {wheelchair_accessible}, {pet_friendly}, {smoking_allowed}
      </p>
      <div className="flex justify-between w-full mt-4">
        <button
          className="flex mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          onClick={handlePrevStep}
        >
          Back
        </button>
        <button
          className="flex mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600"
          onClick={handleFormSubmit}
        >
          Add Property to Profile
        </button>
      </div>
    </div>
  );
};

export default PropertyConfirmation;

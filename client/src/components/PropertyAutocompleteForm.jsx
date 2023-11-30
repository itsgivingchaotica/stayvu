import React, { useEffect, useRef, useState } from "react";
import GoogleMap from "./GoogleMap.jsx";

const PropertyAutocompleteForm = ({
  formData,
  handleInputChange,
  handleNextStep,
  setFormData,
}) => {
  const searchInputRef = useRef(null);
  const [latitude, setLatitude] = useState(0);
  const [longitude, setLongitude] = useState(0);
  const [validationErrors, setValidationErrors] = useState({});

  const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;

//   if (formData.property_type) {
//     console.log(formData.property_type);
//   }

  const handleSubmit = (e) => {
    // e.preventDefault(); // Prevent the default form submission behavior

    // Check for validation errors before moving to the next step
    if (Object.values(validationErrors).some((error) => error !== "")) {
      // Display a general error message or handle it as needed
      //   alert("Please fill in all required fields.");
      return;
    } else {
      // Move to the next step
      handleNextStep(e);
    }
  };

  const handleInputBlur = (field) => {
    // Check if the field is empty and mark it as required if it is
    if (!formData[field]) {
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "Required",
      }));
    } else {
      // Clear validation error if the field is not empty
      setValidationErrors((prevErrors) => ({
        ...prevErrors,
        [field]: "",
      }));
    }
  };

  useEffect(() => {
    // Load Google Maps script
    const script = document.createElement("script");
    script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places&callback=initMap`;
    script.async = false;
    script.defer = true;

    // Script onload callback
    script.onload = () => {
      const autocomplete = new window.google.maps.places.Autocomplete(
        searchInputRef.current,
        {
          types: ["geocode"],
          componentRestrictions: { country: "us" },
        }
      );

      autocomplete.addListener("place_changed", () => {
        setValidationErrors({});
        const place = autocomplete.getPlace();
        const extractedAddress = extractAddress(place);

        // Update formData state with extracted address
        setFormData((prevFormData) => ({
          ...prevFormData,
          ...extractedAddress,
        }));

        // Update setAddress state with extracted address
        // setAddress(extractedAddress);

        // Extract latitude and longitude
        const { geometry } = place;
        if (geometry && geometry.location) {
          const { lat, lng } = geometry.location;
          setLatitude(lat);
          setLongitude(lng);
          // You can store lat and lng in your state or use them as needed.
        }
      });
    };

    // Append the script to the document
    document.body.appendChild(script);

    // Cleanup: Remove the script from the document on component unmount
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  const extractAddress = (place) => {
    const extractedAddress = {
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
    };

    if (!Array.isArray(place?.address_components)) {
      return extractedAddress;
    }

    place.address_components.forEach((component) => {
      const types = component.types;
      const value = component.long_name;

      if (types.includes("street_number") || types.includes("route")) {
        extractedAddress.address1 += value + " ";
      }

      //   if (types.includes("sublocality_level_1") || types.includes("locality")) {
      //     extractedAddress.address2 = value;
      //   }

      if (types.includes("administrative_area_level_1")) {
        extractedAddress.state = value;
      }

      if (types.includes("sublocality_level_1") || types.includes("locality")) {
        extractedAddress.city = value;
      }

      if (types.includes("postal_code")) {
        extractedAddress.zipcode = value;
      }

      if (types.includes("country")) {
        extractedAddress.country = value;
      }
    });

    return extractedAddress;
  };
  return (
    <form autoComplete="off" className="p-4 space-y-4" onSubmit={handleSubmit}>
      {/* Form fields go here */}
      <label htmlFor="address1">Address 1:</label>
      <input
        ref={searchInputRef}
        required
        type="text"
        id="address1"
        name="address1"
        value={formData.address1}
        onChange={handleInputChange}
        onBlur={() => handleInputBlur("address1")}
        className={`font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 ${
          validationErrors.address1 ? "border-red-500" : ""
        }`}
        placeholder="Enter Address 1"
      />
      <div>
        <label htmlFor="address2">Address 2:</label>
        <input
          type="text"
          id="address2"
          name="address2"
          value={formData.address2}
          onChange={handleInputChange}
          className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
          placeholder="Enter Address 2 (Optional)"
        />
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="w-full mr-6">
          <label htmlFor="city">City:</label>
          <input
            required
            type="text"
            id="city"
            name="city"
            value={formData.city}
            onChange={handleInputChange}
            onBlur={() => handleInputBlur("city")}
            className={`font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300 ${
              validationErrors.city ? "border-red-500" : ""
            }`}
            placeholder="Enter city"
          />
        </div>

        <div className="w-full">
          <label htmlFor="state" className="mt-4">
            State:
          </label>
          <input
            required
            type="text"
            id="state"
            name="state"
            value={formData.state}
            onChange={handleInputChange}
            className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter state"
          />
        </div>
      </div>
      <div className="flex w-full  items-center justify-between">
        <div className="w-full mr-6">
          <label htmlFor="city" className="mt-4">
            Country:
          </label>
          <input
            required
            type="text"
            id="country"
            name="country"
            value={formData.country}
            onChange={handleInputChange}
            className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter city"
          />
        </div>

        <div className="w-full">
          <label htmlFor="zipcode" className="mt-4">
            Zipcode:
          </label>
          <input
            required
            type="text"
            id="zipcode"
            name="zipcode"
            value={formData.zipcode}
            onChange={handleInputChange}
            className="font-medium mt-1 p-2 border-2 border-#FF385C rounded-md w-full focus:outline-none focus:ring focus:border-blue-300"
            placeholder="Enter state"
          />
        </div>
      </div>
      <div className="flex w-full items-center justify-between">
        <div className="w-full mr-2">
          <label htmlFor="num_bedrooms" className="mt-4">
            Bedrooms:
          </label>
          <select
            id="num_bedrooms"
            name="num_bedrooms"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={Number(formData.num_bedrooms)}
            onChange={handleInputChange}
          >
            <option value={0.5}>0.5</option>
            <option value={1}>1</option>
            <option value={1.5}>1.5</option>
            <option value={2}>2</option>
            <option value={2.5}>2.5</option>
            <option value={3}>3</option>
            <option value={3.5}>3.5</option>
            <option value={4}>4</option>
            <option value={4.5}>4.5</option>
            <option value={5}>5+</option>
          </select>
        </div>
        <div className="w-full mr-2">
          <label htmlFor="num_beds" className="mt-4">
            Beds:
          </label>
          <select
            id="num_beds"
            name="num_beds"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={Number(formData.num_beds)}
            onChange={handleInputChange}
          >
            <option value={0.5}>0.5</option>
            <option value={1}>1</option>
            <option value={1.5}>1.5</option>
            <option value={2}>2</option>
            <option value={2.5}>2.5</option>
            <option value={3}>3</option>
            <option value={3.5}>3.5</option>
            <option value={4}>4</option>
            <option value={4.5}>4.5</option>
            <option value={5}>5+</option>
          </select>
        </div>
        <div className="w-full mr-6">
          <label htmlFor="num_baths" className="mt-4">
            Bathrooms:
          </label>
          <select
            id="num_baths"
            name="num_baths"
            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            value={Number(formData.num_baths)}
            onChange={handleInputChange}
          >
            <option value={0.5}>0.5</option>
            <option value={1}>1</option>
            <option value={1.5}>1.5</option>
            <option value={2}>2</option>
            <option value={2.5}>2.5</option>
            <option value={3}>3</option>
            <option value={3.5}>3.5</option>
            <option value={4}>4</option>
            <option value={4.5}>4.5</option>
            <option value={5}>5+</option>
          </select>
        </div>
      </div>
      <div>
        <label htmlFor="property_type">Property Type:</label>
        <select
          id="property_type"
          name="property_type"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          value={formData.property_type}
          onChange={handleInputChange}
        >
          <option value="Home">Home</option>
          <option value="Apartment">Apartment</option>
          <option value="Condo">Condo</option>
          <option value="Bed and Breakfast">Bed and Breakfast</option>
          <option value="Hotel">Hotel</option>
          <option value="Townhouse">Townhouse</option>
          <option value="Cottage">Cottage</option>
          <option value="Villa">Villa</option>
          <option value="Duplex">Duplex</option>
          <option value="Loft">Loft</option>
          <option value="Tiny House">Tiny House</option>
        </select>
      </div>
      {latitude !== 0 && longitude !== 0 && (
        <GoogleMap latitude={latitude} longitude={longitude} />
      )}
      <div className="flex justify-end">
        <button
          className="flex mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 "
          type="submit"
        >
          Next
        </button>
      </div>
    </form>
  );
};

export default PropertyAutocompleteForm;

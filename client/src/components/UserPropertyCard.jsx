import React, { useEffect, useState } from "react";
import ListingCarousel from "./ListingCarousel";
import axios from "axios";
import { useSelector } from "react-redux";

const UserPropertyCard = ({ userProperty, handleDeleteProperty }) => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? import.meta.env.VITE_SERVER_URL
      : "http://localhost:3001";

  const [propertyImages, setPropertyImages] = useState([]);
  const userProperties = useSelector(
    (state) => state.properties?.userProperties
  );
  useEffect(() => {
    const fetchPropertyImages = async () => {
      try {
        const res = await axios.get(
          `${API_URL}/api/properties/images/retrieve/${userProperty.id}`,
          { withCredentials: true }
        );
        setPropertyImages(res.data);
      } catch (error) {
        console.error("Error fetching single property images", error);
        throw error;
      }
    };
    fetchPropertyImages();
  }, [userProperties]);

  return (
    <li>
      <div className="bg-white p-8 rounded-md shadow-md w-full mb-4">
        <h2 className="text-2xl font-semibold mb-2">{userProperty.address1}</h2>
        {userProperty?.address2 && (
          <h2 className="text-2xl font-semibold mb-2">
            {userProperty.address2}
          </h2>
        )}
        <h2 className="text-2xl font-semibold mb-2">
          {userProperty.city}, {userProperty.state} {userProperty.zipcode}
        </h2>
        <a href="#">
          <ListingCarousel images={propertyImages} />
        </a>
        <h2 className="text-2xl font-semibold mb-2">
          {userProperty.property_type}, Bedrooms: {userProperty.num_bedrooms},
          Beds: {userProperty.num_beds}, Bathrooms: {userProperty.num_baths}
        </h2>

        <div className="flex justify-between mt-4">
          <button
            onClick={() => handleDeleteProperty(userProperty.property_id)}
            className="bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 w-full"
          >
            Delete
          </button>
        </div>
      </div>
    </li>
  );
};

export default UserPropertyCard;

import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUserProperty } from "../redux/slices/propertiesSlice";
import UserPropertyCard from "./UserPropertyCard";
import {
  fetchUserProperties,
  fetchUserPropertyById,
} from "../redux/slices/propertiesSlice";

const UserProperties = ({
  showForm,
  setShowForm,
  setFormData,
  setAmenities,
  setImageFiles,
  isEditingProperty,
  setIsEditingProperty,
}) => {
  const dispatch = useDispatch();
  const [localUserProperties, setLocalUserProperties] = useState([]);
  const userProperties = useSelector(
    (state) => state.properties?.userProperties
  );
  const user = useSelector((state) => state.user?.loggedInUser);

  const handleDeleteProperty = (index) => {
    const propertyToDelete = userProperties[index];
    dispatch(deleteUserProperty(propertyToDelete));
  };

  const handleEditPropertyForm = (id) => {
    setFormData({
      host_id: user?.id,
      address1: "",
      address2: "",
      city: "",
      state: "",
      country: "",
      zipcode: "",
      num_beds: 1,
      num_baths: 1,
      num_bedrooms: 1,
      property_type: "Home",
    });
    setAmenities({
      wifi: false,
      dryer: false,
      washer: false,
      iron: false,
      air_conditioner: false,
      heater: false,
      pool_available: false,
      grill: false,
      hot_tub: false,
      free_parking: false,
      ev_charger: false,
      beach_front: false,
      water_front: false,
      mountain_view: false,
      city_view: false,
      gym: false,
      elevator: false,
      wheelchair_accessible: false,
      pet_friendly: false,
      smoking_allowed: false,
    });
    setImageFiles([]);
    setIsEditingProperty(!isEditingProperty);
    dispatch(fetchUserPropertyById({ propertyId: id }));
    setShowForm(true);
  };

  //   useEffect(() => {
  //     if (userProperties.length) {
  //       dispatch(fetchUserProperties(user?.id));
  //     }
  //   }, [userProperties, dispatch]);

  useEffect(() => {
    dispatch(fetchUserProperties({ userId: user?.id }));
  }, []);

  return (
    <ul className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-10">
      {userProperties
        ?.map((userProperty, index) => (
          <UserPropertyCard
            key={index}
            userProperty={userProperty}
            handleDeleteProperty={handleDeleteProperty}
            showForm={showForm}
            handleEditPropertyForm={handleEditPropertyForm}
            isEditingProperty={isEditingProperty}
            setIsEditingProperty={setIsEditingProperty}
          />
        ))
        .reverse()}
    </ul>
  );
};

export default UserProperties;

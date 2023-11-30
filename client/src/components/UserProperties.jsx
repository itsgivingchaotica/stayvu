import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { deleteUserProperty } from "../redux/slices/propertiesSlice";
import UserPropertyCard from "./UserPropertyCard";
import { fetchUserProperties } from "../redux/slices/propertiesSlice";

const UserProperties = ({ showForm }) => {
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

  //   useEffect(() => {
  //     if (userProperties.length) {
  //       dispatch(fetchUserProperties(user?.id));
  //     }
  //   }, [userProperties, dispatch]);

  return (
    <ul className="grid grid-cols-1 gap-8 lg:grid-cols-3 mt-10">
      {userProperties?.map((userProperty, index) => (
        <UserPropertyCard
          key={index}
          userProperty={userProperty}
          handleDeleteProperty={handleDeleteProperty}
          showForm={showForm}
        />
      ))}
    </ul>
  );
};

export default UserProperties;

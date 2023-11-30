// Listings.js
import React, { useEffect } from "react";
import ListingsContainer from "../containers/ListingsContainer";
import { useSelector } from "react-redux";

const Listings = ({ data }) => {
  const filteredListings = useSelector(
    (state) => state.listings?.filteredListings
  );

  // useEffect(() => {
  //   // This effect will run whenever filteredListings changes
  //   console.log("filteredListings changed:", filteredListings);
  // }, [filteredListings]);

  return filteredListings.length > 0 ? (
    <div className="h-screen mt-6 mb-6 mx-6">
      <ListingsContainer data={filteredListings} />
    </div>
  ) : (
    <div className="h-screen mt-6 mb-6 mx-6">
      <ListingsContainer data={data} />
    </div>
  );
};

export default Listings;

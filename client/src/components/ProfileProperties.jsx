import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProperties,
  createNewUserProperty,
} from "../redux/slices/propertiesSlice";
import Amenities from "./Amenities.jsx";
import PropertyAutocompleteForm from "./PropertyAutocompleteForm.jsx";
import AddPropertyStepper from "./AddPropertyStepper.jsx";
import ImageUpload from "./ImageUpload.jsx";
import UserProperties from "./UserProperties.jsx";
import PropertyConfirmation from "./PropertyConfirmation.jsx";

const ProfileProperties = ({ setActiveTab }) => {
  const [showForm, setShowForm] = useState(false);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.loggedInUser);
  const userProperties = useSelector(
    (state) => state.properties?.userProperties
  );
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
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

  // if (formData.num_beds) {
  //   console.log(formData.num_beds, "num beds from profile");
  // }

  const [amenities, setAmenities] = useState({
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

  const [imageFiles, setImageFiles] = useState([]);

  const handleFileChange = (e) => {
    const files = e.target.files;
    setImageFiles((prevFiles) => [...prevFiles, ...files]);
  };

  const handleNextStep = (e) => {
    e.preventDefault();
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const handlePrevStep = (e) => {
    e.preventDefault();
    setCurrentStep((prevStep) => prevStep - 1);
  };

  const handleAddPropertyClick = () => {
    setShowForm(!showForm);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    // console.log(name);
    // console.log(value);
    setFormData((prevFormData) => ({
      ...prevFormData,
      [name]: value,
    }));
  };

  const handleDeleteImage = (e, index) => {
    e.preventDefault();
    const updatedImages = [...imageFiles];
    updatedImages.splice(index, 1);
    setImageFiles(updatedImages);
  };

  const handleAmenitiesChange = (key) => {
    setAmenities((prevAmenities) => ({
      ...prevAmenities,
      [key]: !prevAmenities[key],
    }));
  };

  // const handleEditListing = (index) => {
  //   console.log(`Edit clicked for index: ${index}`);
  // };
  if (user) {
    console.log(user.id, "fucking user id");
  }

  const handleFormSubmit = () => {
    // Add the form data to the list of user listings
    // setUserProperties([...userProperties, formData]);
    dispatch(createNewUserProperty({ formData, imageFiles, amenities }));

    // // Clear the form data
    // setFormData({
    //   address1: "",
    //   address2: "",
    //   city: "",
    //   state: "",
    //   country: "",
    //   zipcode: "",
    //   num_beds: null,
    //   num_baths: null,
    //   num_bedrooms: null,
    //   property_type: "",
    // });
    // setImageFiles([]);
    // setAmenities({
    //   wifi: false,
    //   dryer: false,
    //   washer: false,
    //   iron: false,
    //   air_conditioner: false,
    //   heater: false,
    //   pool: false,
    //   grill: false,
    //   hot_tub: false,
    //   free_parking: false,
    //   ev_charger: false,
    //   beach_front: false,
    //   water_front: false,
    //   mountain_view: false,
    //   city_view: false,
    //   gym: false,
    //   elevator: false,
    //   wheelchair_accessible: false,
    //   pet_friendly: false,
    //   smoking_allowed: false,
    // });

    // Hide the form
    setShowForm(false);
    setActiveTab("properties");
  };

  // console.log(amenities);
  // console.log(imageFiles);
  // console.log(formData);

  useEffect(() => {
    dispatch(fetchUserProperties({ userId: user?.id }));
  }, [userProperties]);

  return (
    <div className="flex flex-col justify-center max-w mx-auto mt-8">
      <h1 className="text-center mb-4">Properties</h1>
      <div className="flex flex-col items-center">
        <button
          onClick={handleAddPropertyClick}
          className="w-full mb-10 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          {showForm ? "Hide Form" : "Add Property"}
        </button>
      </div>
      {showForm && (
        <div className="bg-white p-6 rounded-md shadow-md mb-4">
          <AddPropertyStepper currentStep={currentStep} />
          {currentStep === 1 ? (
            <PropertyAutocompleteForm
              formData={formData}
              handleInputChange={handleInputChange}
              handleNextStep={handleNextStep}
              setFormData={setFormData}
            />
          ) : currentStep === 2 ? (
            <ImageUpload
              imageFiles={imageFiles}
              handleDeleteImage={handleDeleteImage}
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleFileChange={handleFileChange}
            />
          ) : currentStep === 3 ? (
            <div className="mt-8">
              <Amenities
                amenities={amenities}
                handleAmenitiesChange={handleAmenitiesChange}
                handleNextStep={handleNextStep}
                handlePrevStep={handlePrevStep}
              />
            </div>
          ) : (
            <div className="mt-8">
              <PropertyConfirmation
                formData={formData}
                amenities={amenities}
                imageFiles={imageFiles}
                handleFormSubmit={handleFormSubmit}
                handlePrevStep={handlePrevStep}
              />
            </div>
          )}
        </div>
      )}

      <UserProperties showForm={showForm} />
    </div>
  );
};

export default ProfileProperties;

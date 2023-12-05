import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  fetchUserProperties,
  createNewUserProperty,
  deleteUserPropertyImage,
  editUserPropertyById,
  fetchUserPropertyImages,
  fetchUserPropertyImagesByPaths,
  removeCurrentProperty,
} from "../redux/slices/propertiesSlice";
import Amenities from "./Amenities.jsx";
import PropertyAutocompleteForm from "./PropertyAutocompleteForm.jsx";
import AddPropertyStepper from "./AddPropertyStepper.jsx";
import ImageUpload from "./ImageUpload.jsx";
import UserProperties from "./UserProperties.jsx";
import PropertyConfirmation from "./PropertyConfirmation.jsx";
import axios from "axios";
import { set } from "lodash";

const ProfileProperties = ({ setActiveTab }) => {
  const API_URL =
    process.env.NODE_ENV === "production"
      ? import.meta.env.VITE_SERVER_URL
      : import.meta.env.VITE_BACKEND_URL;
  const [showForm, setShowForm] = useState(false);
  const [isEditingProperty, setIsEditingProperty] = useState(false);
  const [editingImageFiles, setEditingImageFiles] = useState([]);
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user?.loggedInUser);
  const userProperties = useSelector(
    (state) => state.properties?.userProperties
  );
  const currentProperty = useSelector(
    (state) => state.properties?.currentProperty
  );
  const currentPropertyImages = useSelector(
    (state) => state.properties?.currentPropertyImages
  );

  const [currentStep, setCurrentStep] = useState(4);
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
    //  let files = [];
    //  for (let i = 0; i < e.target.files.length; i++) {
    //    files.push(e.target.files[i].name);
    //  }
    //  console.log(files, "files from handleFileChange");
    //  setImageFiles((prevFiles) => [...prevFiles, ...files]);
    console.log(files, "files from handleFileChange");
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
    if (isEditingProperty) {
      dispatch(removeCurrentProperty());
      setIsEditingProperty(false);
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
    }
    setCurrentStep(1);
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

  const handleDeleteEditingImageFiles = (e, index) => {
    e.preventDefault();
    dispatch(
      deleteUserPropertyImage({
        propertyId: currentProperty.id,
        index,
      })
    );
  };

  const handleAmenitiesChange = (key) => {
    setAmenities((prevAmenities) => ({
      ...prevAmenities,
      [key]: !prevAmenities[key],
    }));
    console.log(amenities);
  };

  const handleEditProperty = (propertyId) => {
    dispatch(
      editUserPropertyById({ propertyId, formData, imageFiles, amenities })
    );
    setShowForm(false);
    setCurrentStep(1);
    setActiveTab("properties");
    setEditingImageFiles([]);
    setIsEditingProperty(false);
  };

  const handleFormSubmit = () => {
    // Add the form data to the list of user listings
    // setUserProperties([...userProperties, formData]);
    console.log(formData, "from react the form Data");
    console.log(amenities, "from react the amenities");
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
    setCurrentStep(1);
    setActiveTab("properties");
  };

  // console.log(amenities);
  // console.log(imageFiles);
  // console.log(formData);

  useEffect(() => {
    if (currentProperty && Object.keys(currentProperty).length > 0) {
      console.log("setting current property");
      setFormData({
        host_id: user?.id,
        address1: currentProperty.address1,
        address2: currentProperty.address2,
        city: currentProperty.city,
        state: currentProperty.state,
        country: currentProperty.country,
        zipcode: currentProperty.zipcode,
        num_beds: currentProperty.num_beds,
        num_baths: currentProperty.num_baths,
        num_bedrooms: currentProperty.num_bedrooms,
        property_type: currentProperty.property_type,
      });
      setAmenities({
        wifi: currentProperty.wifi,
        dryer: currentProperty.dryer,
        washer: currentProperty.washer,
        iron: currentProperty.iron,
        air_conditioner: currentProperty.air_conditioner,
        heater: currentProperty.heater,
        pool_available: currentProperty.pool,
        grill: currentProperty.grill,
        hot_tub: currentProperty.hot_tub,
        free_parking: currentProperty.free_parking,
        ev_charger: currentProperty.ev_charger,
        beach_front: currentProperty.beach_front,
        water_front: currentProperty.water_front,
        mountain_view: currentProperty.mountain_view,
        city_view: currentProperty.city_view,
        gym: currentProperty.gym,
        elevator: currentProperty.elevator,
        wheelchair_accessible: currentProperty.wheelchair_accessible,
        pet_friendly: currentProperty.pet_friendly,
        smoking_allowed: currentProperty.smoking_allowed,
      });
      dispatch(
        fetchUserPropertyImagesByPaths({ propertyId: currentProperty?.id })
      );
    }
  }, [currentProperty]);

  return (
    <div className="flex flex-col justify-center max-w mx-auto mt-8">
      <h1 className="text-center mb-4">Properties</h1>
      <div className="flex flex-col items-center">
        <button
          onClick={handleAddPropertyClick}
          className="w-full mb-10 bg-red-500 text-white rounded-md px-4 py-2 hover:bg-red-600 focus:outline-none focus:ring focus:border-blue-300"
        >
          {showForm && isEditingProperty
            ? "Discard Edits"
            : showForm && !isEditingProperty
            ? "Hide Form"
            : "Add Property"}
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
              isEditingProperty={isEditingProperty}
            />
          ) : currentStep === 2 ? (
            <ImageUpload
              imageFiles={imageFiles}
              handleDeleteImage={handleDeleteImage}
              handleNextStep={handleNextStep}
              handlePrevStep={handlePrevStep}
              handleFileChange={handleFileChange}
              isEditingProperty={isEditingProperty}
              editingImageFiles={editingImageFiles}
              handleDeleteEditingImageFiles={handleDeleteEditingImageFiles}
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
                isEditingProperty={isEditingProperty}
                handleEditProperty={handleEditProperty}
              />
            </div>
          )}
        </div>
      )}

      <UserProperties
        showForm={showForm}
        setShowForm={setShowForm}
        setFormData={setFormData}
        setAmenities={setAmenities}
        setImageFiles={setImageFiles}
        setIsEditingProperty={setIsEditingProperty}
        isEditingProperty={isEditingProperty}
      />
    </div>
  );
};

export default ProfileProperties;

import React from "react";
import { useSelector } from "react-redux";
import { IoCloseOutline } from "react-icons/io5";

const ImageUpload = ({
  handleNextStep,
  handlePrevStep,
  handleDeleteImage,
  imageFiles,
  handleFileChange,
  isEditingProperty,
  editingImageFiles,
  handleDeleteEditingImageFiles,
  handleImageIndexToDelete,
  imageIndexesToDelete,
}) => {
  const currentPropertyImages = useSelector(
    (state) => state.properties?.currentPropertyImages
  );

  if (currentPropertyImages) {
    console.log(currentPropertyImages, "CURRENT PROPERTY IMAGES WHILE EDITING");
  }
  const areImagesUploaded =
    (imageFiles && imageFiles.length > 0) || currentPropertyImages;

  const filteredImages = currentPropertyImages
    .map((image, index) => ({ image, index })) // Map each element with its index
    .filter(({ index }) => !imageIndexesToDelete.includes(index))
    .map(({ image }) => image);

  const handleDeleteAndReload = (e, index) => {
    // Prevent the event from propagating to the parent div, which triggers file input
    e.stopPropagation();
    // Delete the image
    handleDeleteImage(e, index);
  };

  return (
    <div>
      <div className="flex items-center justify-center w-full">
        <label
          htmlFor="dropzone-file"
          className="flex flex-col items-center justify-center w-full h-64 border-2 border-gray-300 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:hover:bg-bray-800 dark:bg-gray-700 hover:bg-gray-100 dark:border-gray-600 dark:hover:border-gray-500 dark:hover:bg-gray-600"
        >
          <div className="flex flex-col items-center justify-center pt-5 pb-6">
            <svg
              className="w-8 h-8 mb-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 16"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M13 13h3a3 3 0 0 0 0-6h-.025A5.56 5.56 0 0 0 16 6.5 5.5 5.5 0 0 0 5.207 5.021C5.137 5.017 5.071 5 5 5a4 4 0 0 0 0 8h2.167M10 15V6m0 0L8 8m2-2 2 2"
              />
            </svg>
            <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
              <span className="font-semibold">Click to upload</span> or drag and
              drop
            </p>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              SVG, PNG, JPG or GIF (MAX. 800x400px)
            </p>
          </div>
          <input
            id="dropzone-file"
            type="file"
            name="dropzone-file"
            className="hidden"
            onChange={handleFileChange}
            multiple
          />
        </label>
      </div>
      <div className="flex mt-8">
        {isEditingProperty && currentPropertyImages ? (
          <div className="grid grid-cols-3 gap-4 relative">
            {filteredImages?.map((image, index) => (
              <div
                className="relative" // Added this class to set relative positioning for the container
                key={index}
                // onClick={(e) => handleDeleteEditingImageFiles(e, index)}
              >
                <div
                  style={{
                    backgroundImage: `url(${image})`,
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    position: "relative",
                  }}
                  className="w-64 h-64 object-cover rounded"
                >
                  <IoCloseOutline
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      cursor: "pointer",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "50px",
                      border: "2px solid white",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = "red";
                      e.currentTarget.style.border = "2px solid red";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.border = "2px solid white";
                    }}
                    onClick={(e) => handleImageIndexToDelete(e, index)}
                  />
                </div>
              </div>
            ))}
            {imageFiles?.map((file, index) => (
              <div
                style={{ position: "relative" }}
                key={index}
                onClick={(e) => handleDeleteAndReload(e, index)}
              >
                <IoCloseOutline
                  style={{
                    position: "absolute",
                    top: 0,
                    right: 0,
                    cursor: "pointer",
                    color: "white",
                    fontWeight: "bold",
                    fontSize: "50px",
                    border: "2px solid white",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.color = "red";
                    e.currentTarget.style.border = "2px solid red";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.color = "white";
                    e.currentTarget.style.border = "2px solid white";
                  }}
                  onClick={(e) => handleDeleteAndReload(e, index)}
                />
                <img
                  src={URL.createObjectURL(file)}
                  alt={`Image ${index + 1}`}
                  className="w-64 h-64 object-cover rounded"
                />
              </div>
            ))}
          </div>
        ) : (
          areImagesUploaded && (
            <div className="grid grid-cols-3 gap-4">
              {imageFiles.map((file, index) => (
                <div
                  style={{ position: "relative" }}
                  key={index}
                  onClick={(e) => handleDeleteAndReload(e, index)}
                >
                  <IoCloseOutline
                    style={{
                      position: "absolute",
                      top: 0,
                      right: 0,
                      cursor: "pointer",
                      color: "white",
                      fontWeight: "bold",
                      fontSize: "50px",
                      border: "2px solid white",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.color = "red";
                      e.currentTarget.style.border = "2px solid red";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.color = "white";
                      e.currentTarget.style.border = "2px solid white";
                    }}
                    onClick={(e) => handleDeleteAndReload(e, index)}
                  />
                  <img
                    src={URL.createObjectURL(file)}
                    alt={`Image ${index + 1}`}
                    className="w-64 h-64 object-cover rounded"
                  />
                </div>
              ))}
            </div>
          )
        )}
      </div>
      <div className="flex justify-between">
        <button
          className="flex mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 "
          onClick={handlePrevStep}
        >
          Back
        </button>
        <button
          className={`flex mt-4 bg-red-500 text-white py-2 px-4 rounded-md hover:bg-red-600 ${
            !areImagesUploaded && "cursor-not-allowed opacity-50"
          }`}
          onClick={handleNextStep}
          disabled={!areImagesUploaded}
        >
          Next
        </button>
      </div>
      {!areImagesUploaded && (
        <p className="text-red-500 mt-2 text-sm">Upload at least 1 photo.</p>
      )}
    </div>
  );
};

export default ImageUpload;

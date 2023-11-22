import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import stayvueLogo from "../assets/StayVue.png";
import search from "../assets/search.png";
import LoginModal from "./LoginModal";
import DropdownMenu from "./DropdownMenu";
// import DatePicker from "react-datepicker";
import { useDispatch } from "react-redux";
import {
  clearFilteredListings,
  filterListingsBySearch,
} from "../redux/slices/listingsSlice";
import "react-datepicker/dist/react-datepicker.css";
// import moment from "moment";
import { format } from "date-fns";
import dayjs from "dayjs";
import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";

const Navbar = ({ isModalOpen, setIsModalOpen }) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const user = useSelector((state) => state.user?.loggedInUser);
  const dispatch = useDispatch();

  useEffect(() => {
    if (user) {
      setIsModalOpen(false);
    }
  }, [user]);

  const handleButtonClick = () => {
    dispatch(filterListingsBySearch({ startDate, endDate }));
    console.log(startDate);
    console.log(endDate, "from handler");
  };

  const handleHomeClick = () => {
    if (isDropdownOpen) {
      toggleDropdown();
    }
  };

  const toggleDropdown = () => {
    if (!isModalOpen) {
      setIsDropdownOpen(!isDropdownOpen);
    }
  };

  const toggleLoginModal = () => {
    setIsModalOpen(!isModalOpen);
    console.log("MODAL open");
  };

  const handleDateChange = (date, type) => {
    // const formattedDate = format(new Date(date), "yyyy-MM-dd");
    console.log(date);
    const jsDate = date.toDate();
    const formattedDate = jsDate ? format(jsDate, "yyyy-MM-dd") : null;

    console.log(formattedDate);

    if (type === "start") {
      setStartDate(formattedDate);
    } else {
      setEndDate(formattedDate);
    }
  };

  const handleClearFilters = () => {
    dispatch(clearFilteredListings());
  };
  return (
    <nav className="bg-white border-b-1 border-gray-300 w-full mt-4">
      <div className="flex justify-between items-center">
        <div className="logo">
          <Link to="/">
            <div onClick={handleHomeClick}>
              <img src={stayvueLogo} alt="Logo" className="w-32 ml-3" />
            </div>
          </Link>
        </div>
        <div className="search-bar rounded-3xl p-4 shadow-md flex items-center w-2/3 justify-evenly">
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <button
              className="border-none w-8/12"
              onClick={() => handleButtonClick("Anywhere")}
            >
              Anywhere
            </button>
            {/* Date picker for start date */}
            {/* <DatePicker
              selected={startDate}
              onChange={(date) => handleDateChange(date, "start")}
              selectsStart
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check in"
              className="w-9/12"
            /> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Check-in"
                value={startDate}
                onChange={(date) => handleDateChange(date, "start")}
              />
            </LocalizationProvider>
            {/* Date picker for end date */}
            {/* <DatePicker
              selected={endDate}
              onChange={(date) => handleDateChange(date, "end")}
              className="w-9/12"
              selectsEnd
              startDate={startDate}
              endDate={endDate}
              placeholderText="Check-out"
            /> */}
            <LocalizationProvider dateAdapter={AdapterDayjs}>
              <DatePicker
                label="Check-out"
                value={endDate}
                onChange={(date) => handleDateChange(date, "end")}
              />
            </LocalizationProvider>
          </div>
          <div
            className="ml-4"
            style={{ display: "flex", gap: "10px", alignItems: "center" }}
          >
            <button
              className="border-none w-9/12 justify-center text-center mr-6"
              onClick={handleClearFilters}
            >
              Clear Filters
            </button>
            <button
              className="border-none p-5"
              onClick={() => handleButtonClick("Search")}
            >
              <img src={search} alt="search button" />
            </button>
          </div>
        </div>
        <DropdownMenu
          toggleLoginModal={toggleLoginModal}
          toggleDropdown={toggleDropdown}
          isDropdownOpen={isDropdownOpen}
        />
      </div>
      {isModalOpen && <LoginModal toggleLoginModal={toggleLoginModal} />}
    </nav>
  );
};

export default Navbar;

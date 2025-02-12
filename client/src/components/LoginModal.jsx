import React, { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { authLogIn, authRegister } from "../redux/slices/userSlice";
import { set } from "date-fns";

const LoginModal = ({ toggleLoginModal }) => {
  const [isRegistering, setIsRegistering] = useState(false);
  const [userEmail, setUserEmail] = useState("");
  const [userPassword, setUserPassword] = useState("");
  const [userFirstName, setUserFirstName] = useState("");
  const [userLastName, setUserLastName] = useState("");
  const [userMobileNumber, setUserMobileNumber] = useState("");
  const [userZipcode, setUserZipcode] = useState("");
  const [userUsername, setUserUsername] = useState("");
  const dispatch = useDispatch();
  const handleRegisterClick = () => {
    setIsRegistering(true);
  };

  const handleLoginClick = () => {
    setIsRegistering(false);
  };

  const handleLoginUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(authLogIn({ email: userEmail, password: userPassword }));
    } catch (error) {
      console.error("Error authenticating user:", error);
    }
  };

  const handleRegisterUser = async (e) => {
    e.preventDefault();
    try {
      await dispatch(
        authRegister({
          first_name: userFirstName,
          last_name: userLastName,
          zipcode: userZipcode,
          phone: userMobileNumber,
          user_name: userUsername,
          email: userEmail,
          password: userPassword,
        })
      );
    } catch (error) {
      console.error("Error registering user:", error);
    }
  };

  const handleEnterPassword = (e) => {
    setUserPassword(e.target.value);
  };

  const handleEnterEmail = (e) => {
    setUserEmail(e.target.value);
  };

  const handleEnterFirstName = (e) => {
    setUserFirstName(e.target.value);
  };

  const handleEnterLastName = (e) => {
    setUserLastName(e.target.value);
  };

  const handleEnterMobileNumber = (e) => {
    setUserMobileNumber(e.target.value);
  };

  const handleEnterZipcode = (e) => {
    setUserZipcode(e.target.value);
  };

  const handleEnterUsername = (e) => {
    setUserUsername(e.target.value);
  };

  return isRegistering ? (
    <div
      id="authentication-modal"
      tabIndex="-1"
      aria-hidden="true"
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-4/5 md:w-max p-4 overflow-x-hidden overflow-y-auto max-h-full`}
    >
      <div className="relative w-full max-w-3xl max-h-full">
        <div className="relative bg-white rounded-lg shadow dark-bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover-bg-gray-200 hover-text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark-hover-bg-gray-600 dark-hover-text-white"
            data-modal-hide="authentication-modal"
            onClick={toggleLoginModal}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <div className="flex flex-col justify-center items-center">
              <div className="mb-4 text-3xl font-medium text-gray-900 dark-text-white">
                Registration
              </div>
              <div className="mb-4 text-xl font-medium text-gray-900 dark-text-white">
                Stays and Perks Await!
              </div>
            </div>
            <form className="space-y-4" action="#">
              <div className="w-[36em]">
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-ring-blue-500 focus-border-blue-500 block w-full p-2.5 dark-bg-gray-600 dark-border-gray-500 dark-placeholder-gray-400 dark-text-white"
                  placeholder="name@company.com"
                  required
                  onChange={handleEnterEmail}
                />
              </div>
              <div>
                <label
                  htmlFor="username"
                  className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                >
                  Pick a username
                </label>
                <input
                  type="username"
                  name="username"
                  id="username"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-ring-blue-500 focus-border-blue-500 block w-full p-2.5 dark-bg-gray-600 dark-border-gray-500 dark-placeholder-gray-400 dark-text-white"
                  required
                  onChange={handleEnterUsername}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-ring-blue-500 focus-border-blue-500 block w-full p-2.5 dark-bg-gray-600 dark-border-gray-500 dark-placeholder-gray-400 dark-text-white"
                  required
                  onChange={handleEnterPassword}
                />
              </div>
              <div className="flex">
                <div className="w-1/2 pr-2">
                  <label
                    htmlFor="first-name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                  >
                    First Name
                  </label>
                  <input
                    type="first-name"
                    name="first-name"
                    id="first-name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-ring-blue-500 focus-border-blue-500 block w-full p-2.5 dark-bg-gray-600 dark-border-gray-500 dark-placeholder-gray-400 dark-text-white"
                    required
                    onChange={handleEnterFirstName}
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label
                    htmlFor="last-name"
                    className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                  >
                    Last Name
                  </label>
                  <input
                    type="last-name"
                    name="last-name"
                    id="last-name"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-ring-blue-500 focus-border-blue-500 block w-full p-2.5 dark-bg-gray-600 dark-border-gray-500 dark-placeholder-gray-400 dark-text-white"
                    required
                    onChange={handleEnterLastName}
                  />
                </div>
              </div>
              <div className="flex justify-between">
                <div className="w-1/2 pr-2">
                  <label
                    htmlFor="mobile-number"
                    className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                  >
                    Mobile Number
                  </label>
                  <input
                    type="mobile-number"
                    name="mobile-number"
                    id="mobile-number"
                    placeholder="(646) 901-2142"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-ring-blue-500 focus-border-blue-500 block w-full p-2.5 dark-bg-gray-600 dark-border-gray-500 dark-placeholder-gray-400 dark-text-white"
                    required
                    onChange={handleEnterMobileNumber}
                  />
                </div>
                <div className="w-1/2 pl-2">
                  <label
                    htmlFor="zipcode"
                    className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                  >
                    Zipcode
                  </label>
                  <input
                    type="zipcode"
                    name="zipcode"
                    id="zipcode"
                    className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-ring-blue-500 focus-border-blue-500 block w-full p-2.5 dark-bg-gray-600 dark-border-gray-500 dark-placeholder-gray-400 dark-text-white"
                    required
                    onChange={handleEnterZipcode}
                  />
                </div>
              </div>
              <button
                type="submit"
                className="w-full text-white bg-button-color hover-bg-blue-800 focus-ring-4 focus-outline-none focus-ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark-bg-blue-600 dark-hover-bg-blue-700 dark-focus-ring-blue-800"
                onClick={handleRegisterUser}
              >
                Create Account
              </button>
              <div className="text-sm font-medium text-gray-500 dark-text-gray-300">
                Already have an account?{" "}
                <div
                  className="text-blue-700 hover-underline dark-text-blue-500 cursor-pointer"
                  onClick={handleLoginClick}
                >
                  Login
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div
      id="authentication-modal"
      tabIndex="-1"
      aria-hidden="true"
      className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50 w-full md:w-max p-4 overflow-x-hidden overflow-y-auto max-h-full`}
    >
      <div className="relative w-full max-w-md max-h-full">
        <div className="relative bg-white rounded-lg shadow dark-bg-gray-700">
          <button
            type="button"
            className="absolute top-3 right-2.5 text-gray-400 bg-transparent hover-bg-gray-200 hover-text-gray-900 rounded-lg text-sm w-8 h-8 ml-auto inline-flex justify-center items-center dark-hover-bg-gray-600 dark-hover-text-white"
            data-modal-hide="authentication-modal"
            onClick={toggleLoginModal}
          >
            <svg
              className="w-3 h-3"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 14 14"
            >
              <path
                stroke="currentColor"
                stroke-linecap="round"
                stroke-linejoin="round"
                stroke-width="2"
                d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"
              />
            </svg>
            <span className="sr-only">Close modal</span>
          </button>
          <div className="px-6 py-6 lg:px-8">
            <h3 className="mb-4 text-xl font-medium text-gray-900 dark-text-white">
              Sign in to our platform
            </h3>
            <form className="space-y-6" action="#">
              <div>
                <label
                  htmlFor="email"
                  className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                >
                  Your email
                </label>
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-ring-blue-500 focus-border-blue-500 block w-full p-2.5 dark-bg-gray-600 dark-border-gray-500 dark-placeholder-gray-400 dark-text-white"
                  placeholder="name@company.com"
                  required
                  onChange={handleEnterEmail}
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark-text-white"
                >
                  Your password
                </label>
                <input
                  type="password"
                  name="password"
                  id="password"
                  placeholder="••••••••"
                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus-ring-blue-500 focus-border-blue-500 block w-full p-2.5 dark-bg-gray-600 dark-border-gray-500 dark-placeholder-gray-400 dark-text-white"
                  required
                  onChange={handleEnterPassword}
                />
              </div>
              {/* <div className="justify-between">
                <div className="flex items-start">
                  <div className="flex items-center h-5">
                    <input
                      id="remember"
                      type="checkbox"
                      value=""
                      className="w-4 h-4 border border-gray-300 rounded bg-gray-50 focus-ring-3 focus-ring-blue-300 dark-bg-gray-600 dark-border-gray-500 dark-focus-ring-blue-600 dark-ring-offset-gray-800 dark-focus-ring-offset-gray-800"
                      required
                    />
                  </div>
                  <label
                    htmlFor="remember"
                    className="ml-2 text-sm font-medium text-gray-900 dark-text-gray-300"
                  >
                    Remember me
                  </label>
                </div>
                <div>
                  <a
                    href="#"
                    className="flex justify-center text-sm text-blue-700 hover-underline dark-text-blue-500 mt-8"
                  >
                    Lost Password?
                  </a>
                </div>
              </div> */}
              <button
                type="submit"
                className="w-full text-white bg-blue-700 hover-bg-blue-800 focus-ring-4 focus-outline-none focus-ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center dark-bg-blue-600 dark-hover-bg-blue-700 dark-focus-ring-blue-800"
                onClick={handleLoginUser}
              >
                Login to your account
              </button>
              <div className="text-sm font-medium text-gray-500 dark-text-gray-300">
                Not registered?{" "}
                <div
                  href="#"
                  className="text-blue-700 hover-underline dark-text-blue-500 cursor-pointer"
                  onClick={handleRegisterClick}
                >
                  Create account
                </div>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginModal;

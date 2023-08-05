import React, { useState } from "react";

const ProfileImage: React.FC = () => {
  const defaultImageUrl =
    "https://upload.wikimedia.org/wikipedia/commons/thumb/3/3f/Git_icon.svg/2048px-Git_icon.svg.png";
  const [isHovering, setIsHovering] = useState(false);
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [imageUrlInput, setImageUrlInput] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState(defaultImageUrl);

  const handleImageClick = () => {
    setIsPopupVisible(!isPopupVisible);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setImageUrlInput(event.target.value);
  };

  const handleApplyImage = () => {
    setProfileImageUrl(imageUrlInput);
    setIsPopupVisible(false);
    setImageUrlInput("");
  };

  const handlePopupClose = () => {
    setIsPopupVisible(false);
    setImageUrlInput("");
  };

  return (
    <div className="relative">
      <div
        className="w-10 h-10 bg-gray-400 rounded-full relative cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={handleImageClick}
      >
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />
        {isHovering && (
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="1em"
            viewBox="0 0 448 512"
            style={{
              fill: "#ffffff",
              position: "absolute",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <path d="M256 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H48c-17.7 0-32 14.3-32 32s14.3 32 32 32H192V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H400c17.7 0 32-14.3 32-32s-14.3-32-32-32H256V80z" />
          </svg>
        )}
      </div>
      {isPopupVisible && (
        <div className="fixed inset-0 flex justify-center items-center backdrop-brightness-50">
          <div
            className="bg-white border rounded-lg p-4"
            style={{ maxWidth: "400px" }}
          >
            <div className="flex justify-end">
              <button
                onClick={handlePopupClose}
                className="text-gray-400 hover:text-gray-600"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 352 512"
                  height="1em"
                >
                  <path
                    fill="currentColor"
                    d="M213.25 256l120.38 120.4c6.25 6.25 6.25 16.38 0 22.63l-22.63 22.63c-6.25 6.25-16.38 6.25-22.63 0L168 300.87 47.62 421.25c-6.25 6.25-16.38 6.25-22.63 0l-22.63-22.63c-6.25-6.25-6.25-16.38 0-22.63L124.75 256 4.37 135.62c-6.25-6.25-6.25-16.38 0-22.63l22.63-22.63c6.25-6.25 16.38-6.25 22.63 0L168 211.13 288.38 90.75c6.25-6.25 16.38-6.25 22.63 0l22.63 22.63c6.25 6.25 6.25 16.38 0 22.63L213.25 256z"
                  />
                </svg>
              </button>
            </div>
            <p>Enter the URL of the PNG you want as a profile picture:</p>
            <div className="flex items-center justify-center space-x-2">
              <input
                type="text"
                value={imageUrlInput}
                onChange={handleInputChange}
                className="w-full border rounded-lg p-1 mt-2"
              />
              <button
                onClick={handleApplyImage}
                className="bg-blue-500 text-white mt-2 px-4 py-1 rounded-lg"
              >
                Apply
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProfileImage;

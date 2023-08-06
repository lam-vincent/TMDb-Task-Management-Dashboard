import React, { useState } from "react";

interface ProfileImageProps {
  profileImageUrl: string;
}

const ProfileImage: React.FC<ProfileImageProps> = ({ profileImageUrl }) => {
  const [isHovering, setIsHovering] = useState(false);

  return (
    <div className="relative">
      <div
        className="w-12 h-12 bg-gray-400 rounded-full relative cursor-pointer"
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      >
        <img
          src={profileImageUrl}
          alt="Profile"
          className="w-full h-full object-cover rounded-full"
        />
        {isHovering && (
          // plus icon
          <svg
            xmlns="http://www.w3.org/2000/svg"
            height="2em"
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
    </div>
  );
};

export default ProfileImage;

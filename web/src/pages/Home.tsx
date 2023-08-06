import React, { useState, useEffect } from "react";
import TaskList from "../components/TaskList";
import { useNavigate } from "react-router-dom";
import { Modal } from "../components/Modal";
import ProfileImage from "../components/ProfileImage";
import Header from "../components/Header";

const Home: React.FC = () => {
  const backgroundImage = "background-image-3.jpg";
  const navigate = useNavigate();
  const [username, setUsername] = useState("");
  const [profileImageUrl, setProfileImageUrl] = useState("");
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    fetchUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchUser = async () => {
    const jwtToken = localStorage.getItem("jwtToken");
    if (!jwtToken) navigate("/login");

    try {
      const res = await fetch("http://localhost:3000/me", {
        headers: { authorization: "Bearer " + jwtToken },
      });
      if (res.status == 401) {
        navigate("/login");
      }
      const data = await res.json();
      setUsername(data.username);
      setProfileImageUrl(data.profilePictureUrl);
    } catch (error) {
      console.error("Error retrieving user:", error);
    }
  };

  const submitFormImage = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const target = e.currentTarget;
    const imageURL = target?.imageInput.value;

    try {
      const jwtToken = localStorage.getItem("jwtToken");
      if (!jwtToken) navigate("/login");

      const response = await fetch("http://localhost:3000/profile/picture", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          authorization: "Bearer " + jwtToken,
        },
        body: JSON.stringify({ profilePictureUrl: imageURL }),
      });

      if (!response.ok) {
        throw new Error("Failed to update profile picture");
      }

      fetchUser();
    } catch (error) {
      console.error("Error updating profile picture:", error);
    }
  };

  return (
    <div>
      <Modal onClose={() => setOpenModal(false)} open={openModal}>
        <form onSubmit={submitFormImage}>
          <p>Enter the URL of the PNG you want as a profile picture:</p>
          <div className="flex items-center justify-center space-x-2">
            <input
              name="imageInput"
              type="text"
              className="w-full border rounded-lg p-1 mt-2"
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white mt-2 px-4 py-1 rounded-lg"
            >
              Apply
            </button>
          </div>
        </form>
      </Modal>
      <div
        className="flex justify-center items-center text-neutral-800 bg-cover bg-center w-screen h-screen"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="border rounded-3xl w-4/5 h-4/5 p-1 border-gray-100">
          <div className="flex items-center w-full h-full p-4 rounded-3xl backdrop-brightness-125 bg-white/30 backdrop-blur-sm">
            <aside className="flex flex-col justify-between items-center gap-8 w-64 h-full bg-white rounded-3xl p-8 m-2">
              <Header />
              <div className="flex justify-between items-center">
                <span className="text-sm">
                  Simple and efficient tasks application
                </span>
              </div>
              <div className="flex flex-col justify-center items-center gap-4">
                <h2 className="text-lg font-bold underline">The stack</h2>
                <ul className="flex flex-col justify-center translate-x-4 list-disc">
                  <li>React</li>
                  <li>TypeScript</li>
                  <li>Tailwind CSS</li>
                  <li>Node.js</li>
                  <li>Express</li>
                  <li>Prisma</li>
                  <li>SQLite</li>
                </ul>
              </div>
              <div>
                <button
                  type="button"
                  onClick={() => {
                    navigate("/login");
                    localStorage.removeItem("jwtToken");
                  }}
                  className="text-center w-full underline hover:text-blue-500"
                >
                  sign out
                </button>
              </div>
            </aside>
            <section className="flex-1 overflow-hidden flex flex-col justify-center">
              <div className="w-full px-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold mb-2">Hi, {username}!</h1>
                  <button onClick={() => setOpenModal(true)}>
                    <ProfileImage profileImageUrl={profileImageUrl} />
                  </button>
                </div>
              </div>
              <TaskList />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

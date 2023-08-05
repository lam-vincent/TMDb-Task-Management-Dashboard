import React from "react";
import TaskList from "../components/TaskList";
import vincentImage from "../../public/vincent.png";
import { useNavigate } from "react-router-dom";

const Home: React.FC = () => {
  const backgroundImage = "background-image-3.jpg";
  const navigate = useNavigate();

  return (
    <div>
      <div
        className="flex justify-center items-center text-neutral-800 bg-cover bg-center w-screen h-screen"
        style={{ backgroundImage: `url(${backgroundImage})` }}
      >
        <div className="border rounded-3xl w-4/5 h-4/5 p-1 border-gray-100">
          <div className="flex justify-center items-center w-full h-full p-4 rounded-3xl backdrop-brightness-125 bg-white/30 backdrop-blur-sm">
            <aside className="flex flex-col justify-between items-center gap-8 w-96 h-full bg-white rounded-3xl p-8 m-2">
              <div className="flex flex-col justify-center items-center gap-4">
                <div className="flex justify-center items-center gap-1 font-bold">
                  <h1 className="text-2xl font-extrabold bg-yellow-500 p-1.5 pt-1 rounded">
                    TMDb
                  </h1>
                  <span className="text-xs translate-y-1">:</span>
                  <span className="text-xs translate-y-1">
                    Task Management Dashboard
                  </span>
                </div>
              </div>
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
            <section className="flex flex-col justify-center items-center w-full h-full">
              <div className="w-full px-8">
                <div className="flex justify-between items-center">
                  <h1 className="text-2xl font-bold mb-2">Hi, {username}!</h1>
                  <div className="w-10 h-10 bg-gray-400 rounded-full">
                    <img
                      src={vincentImage}
                      alt="Vincent"
                      className="w-full h-full object-cover rounded-full"
                    />
                  </div>
                </div>
              </div>
              <div className="w-full">
                <TaskList />
              </div>
            </section>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;

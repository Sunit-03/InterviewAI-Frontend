import React, { useState, useContext } from "react";
import { APP_Features } from "../utils/data";
import { useNavigate } from "react-router-dom";
import { LuSparkles } from "react-icons/lu";

// import Hero_img from "../assets/Hero_img.png";
import hero_page from "../assets/hero_page.png";
import Modal from "../components/Modal";
import Login from "./Auth/Login";
import SignUp from "./Auth/SignUp";
import { UserContext } from "../context/userContext";
import ProfileInfoCard from "../components/Cards/ProfileInfoCard";

const LandingPage = () => {
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [openAuthModal, setOpenAuthModal] = useState(false);
  const [currentPage, setCurrentPage] = useState("login");

  const handleCTA = () => {
    if (!user) {
      setOpenAuthModal(true);
    } else {
      navigate("/dashboard");
    }
  };
  return (
    <>
      <div className="w-full min-h-full bg-[#fffcef]">
        <div className="w-[500px] h-[500px] bg-amber-200/20 blur-[65px] absolute top-0 left-0" />
        <div className="continer max-auto px-4 pt-6 pb-[200px] relative z-10">
          {/* Header Element */}
          <header className="flex justify-between items-center mb-16">
            <div className="text-xl text-black font-bold">InterviewAI</div>
            {user ? (
              <ProfileInfoCard />
            ) : (
              <button
                className="bg-linear-to-r from-[#FF9324] to-[#e99a4b] text-sm font-semibold text-white px-2.5 py-2.5 rounded-sm hover:bg-black hover:text-white border border-white transition-colors cursor-pointer"
                onClick={() => setOpenAuthModal(true)}
              >
                Login / Sign Up
              </button>
            )}
          </header>
          {/* Hero Section */}
          <div className="flex flex-col md:flex-row items-center">
            <div className="w-full md:w-1/2 mb-8 md:mb-0">
              <div className="flex items-center justify-left mb-2">
                <div className="flex items-center gap-2 text-[13px] text-amber-600 font-semibold bg-amber-100 px-3 py-1 rounded-sm border border-amber-300">
                  <LuSparkles /> AI Powered
                </div>
              </div>
              <h1 className="text-5xl font-bold text-black mb-6 leading-tight">
                Ace Your Interviews with <br />
                <span className="text-transparent bg-clip-text bg-[radial-gradient(circle,_#FF9324_0%,_#FCD760_100%)] bg-[length:200%_200%] animate-text-shine font-semibold">
                  AI-Powered
                </span>{" "}
                Learning
              </h1>
            </div>
            <div className="w-full md:w-1/2">
              <p className="text-[17px] text-gray-900 mr-0 md:mr-20 mb-6">
                Get personalized interview questions with the role specified,
                expand answers as you need them and dive deeper into concepts
                with AI-powered explanations. Organize everything your way, from
                preparation to mastery this is your ultimate interview toolkit.
              </p>
              <button
                className="bg-black text-sm font-semibold text-white px-7 py-2.5 rounded-sm hover:bg-yellow-100 hover:text-black border border-yellow-50 hover:border-yellow-300 transition-colors cursor-pointer"
                onClick={handleCTA}
              >
                Get Started
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="w-full min-h-full relative z-10">
        {/* need to change the hero image later on */}
        <div className="flex items-center justify-center -mt-36">
          <section className="border border-amber-300 rounded-sm">
            <img src={hero_page} alt="Hero Image" className="rounded-lg w-300 h-150" />
          </section>
        </div>

        <div className="w-full min-h-full bg-[#fffcef] mt-10">
          <div className="continer mx-10 auto px-4 pt-10 pb-20">
            <section className="mt-5">
              <h2 className="text-2xl font-medium text-center mb-12">
                Enhanced features to keep you ahead in the game
              </h2>
              <div className="flex flex-col items-center gap-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {APP_Features.slice(0, 3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-[#fffcef] p-6 rounded-lg hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                    >
                      <h3 className="text-bold font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {APP_Features.slice(3).map((feature) => (
                    <div
                      key={feature.id}
                      className="bg-[#fffcef] p-6 rounded-lg hover:shadow-lg shadow-amber-100 transition border border-amber-100"
                    >
                      <h3 className="text-bold font-semibold mb-3">
                        {feature.title}
                      </h3>
                      <p className="text-gray-600">{feature.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        </div>
        <div className="text-sm bg-gray-50 text-secondary text-center p-5 mt-10">
          Made with ❤️... ALL THE BEST
        </div>
      </div>

      <Modal
        isOpen={openAuthModal}
        onClose={() => {
          setOpenAuthModal(false);
          setCurrentPage("login");
        }}
        hideHeader
      >
        <div>
          {currentPage === "login" && <Login setCurrentPage={setCurrentPage} />}
          {currentPage === "signup" && (
            <SignUp setCurrentPage={setCurrentPage} />
          )}
        </div>
      </Modal>
    </>
  );
};

export default LandingPage;

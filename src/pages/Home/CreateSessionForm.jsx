import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = () => {
  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsForFocus: "",
    description: "",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();

    const { role, experience, topicsForFocus, description } = formData;

    if (!role || !experience || !topicsForFocus || !description) {
      setError("All fields are required.");
      return;
    }

    setError("");
    setIsLoading(true);

    try {
        const aiResponse = await axiosInstance.post(API_PATHS.AI.GENERATE_QUESTIONS, {
            role,
            experience,
            topicsForFocus,
            numberOfQuestions: 10,
        });

        const generatedQuestions = aiResponse.data;
        const response = await axiosInstance.post(API_PATHS.SESSIONS.CREATE, {
            ...formData,
            questions: generatedQuestions,
        });

        if (response.data?.session?._id){
            navigate(`/interview-prep/${response.data.session._id}`);
        }
    } catch (error) {
        if(error.response && error.response.data.message){
            setError(error.response.data.message);
        }
        else{
            setError("An error occurred while creating the session. Please try again.");
        }
    } finally {
        setIsLoading(false);
    }
  };
  return (
    <div className="m-5">
      <h3 className="text-2xl font-bold text-black">Create a new Interview Preparation Session</h3>
      <p className="text-[13px] font-semibold mb-5">
        Fill out the form below to create a new session tailored to your
        interview preparation needs.
      </p>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
        <Input
          value={formData.role}
          onChange={({ target }) => handleChange("role", target.value)}
          label="Target Role"
          placeholder="(e.g. Software Engineer, Data Scientist, etc.)"
          type="text"
        />

        <Input
            value={formData.experience}
            onChange={({ target }) =>
                handleChange("experience", target.value)
            }
            label="Experience Level"
            placeholder="(e.g. 1 year, 3 years, etc.)"
            type="text"
        />

        <Input
            value={formData.topicsForFocus}
            onChange={({ target }) =>
                handleChange("topicsForFocus", target.value)
            }
            label="Topics for Focus"
            placeholder="(Comma separated, e.g. Data Structures, Algorithms, System Design, etc.)"
            type="text"
        />
        <Input
          value={formData.description}
          onChange={({ target }) =>
            handleChange("description", target.value)
          }
          label="Session Description"
          placeholder="(Any specific notes for the session)"
          type="text"
        />

        {error && <p className="text-red-500 text-xs pb-2.5">{error}</p>}

        <button
        type="submit"
        className="btn-primary w-full mt-2"
        disabled={isLoading}
        >
        {isLoading && <SpinnerLoader/>} Create Session
        </button>
      </form>
    </div>
  );
};

export default CreateSessionForm;

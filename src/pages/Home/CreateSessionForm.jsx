import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import Input from "../../components/Inputs/Input";
import SpinnerLoader from "../../components/Loader/SpinnerLoader";
import axiosInstance from "../../utils/axiosInstance";
import { API_PATHS } from "../../utils/apiPaths";

const CreateSessionForm = () => {
  const [useJobDescription, setUseJobDescription] = useState(false);

  const [formData, setFormData] = useState({
    role: "",
    experience: "",
    topicsForFocus: "",
    description: "",
  });

  const [jobDescription, setJobDescription] = useState("");
  const [isJdUploadMode, setIsJdUploadMode] = useState(false);
  const [jdFileName, setJdFileName] = useState("");
  const [isExtracting, setIsExtracting] = useState(false);

  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const navigate = useNavigate();

  const handleChange = (key, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [key]: value,
    }));
  };

  const handleSwitchMode = (jdMode) => {
    setUseJobDescription(jdMode);
    setError("");
  };

  const handleToggleJdUploadMode = (uploadMode) => {
    setIsJdUploadMode(uploadMode);
    setJdFileName("");
    setJobDescription("");
  };

  const handleJdFileChange = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setJdFileName(file.name);
    setError("");
    setIsExtracting(true);

    try {
      const fileFormData = new FormData();
      fileFormData.append("file", file);

      const response = await axiosInstance.post(
        API_PATHS.AI.EXTRACT_JOB_DESCRIPTION,
        fileFormData,
        { headers: { "Content-Type": "multipart/form-data" } }
      );

      setJobDescription(response.data.text);
    } catch (error) {
      setJdFileName("");
      if (error.response && error.response.data.message) {
        setError(error.response.data.message);
      } else {
        setError("Failed to read the job description file. Please try again.");
      }
    } finally {
      setIsExtracting(false);
    }
  };

  const handleCreateSession = async (e) => {
    e.preventDefault();
    setError("");

    if (useJobDescription) {
      if (!jobDescription.trim()) {
        setError("Please paste or upload a job description.");
        return;
      }

      setIsLoading(true);
      try {
        const aiResponse = await axiosInstance.post(
          API_PATHS.AI.GENERATE_QUESTIONS_FROM_JD,
          {
            jobDescription,
            numberOfQuestions: 10,
          }
        );

        const { role, experience, topicsForFocus, questions } = aiResponse.data;

        const response = await axiosInstance.post(API_PATHS.SESSIONS.CREATE, {
          role,
          experience,
          topicsForFocus,
          description: formData.description,
          jobDescription,
          questions,
        });

        if (response.data?.session?._id) {
          navigate(`/interview-prep/${response.data.session._id}`);
        }
      } catch (error) {
        if (error.response && error.response.data.message) {
          setError(error.response.data.message);
        } else {
          setError("An error occurred while creating the session. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
      return;
    }

    const { role, experience, topicsForFocus, description } = formData;

    if (!role || !experience || !topicsForFocus || !description) {
      setError("All fields are required.");
      return;
    }

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

      <div className="flex items-center gap-2 mb-5">
        <button
          type="button"
          onClick={() => handleSwitchMode(false)}
          className={`text-[13px] px-4 py-1.5 rounded-full border ${
            !useJobDescription
              ? "bg-primary text-white border-primary"
              : "text-slate-600 border-slate-300"
          }`}
        >
          Fill Details Manually
        </button>
        <button
          type="button"
          onClick={() => handleSwitchMode(true)}
          className={`text-[13px] px-4 py-1.5 rounded-full border ${
            useJobDescription
              ? "bg-primary text-white border-primary"
              : "text-slate-600 border-slate-300"
          }`}
        >
          Generate from Job Description
        </button>
      </div>

      <form onSubmit={handleCreateSession} className="flex flex-col gap-4">
        {!useJobDescription ? (
          <>
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
          </>
        ) : (
          <>
            <div>
              <label className="text-[13px] text-slate-800">
                Job Description
              </label>

              <div className="flex items-center gap-2 mt-1 mb-2">
                <button
                  type="button"
                  onClick={() => handleToggleJdUploadMode(false)}
                  className={`text-[12px] px-3 py-1 rounded-full border ${
                    !isJdUploadMode
                      ? "bg-primary text-white border-primary"
                      : "text-slate-600 border-slate-300"
                  }`}
                >
                  Paste Text
                </button>
                <button
                  type="button"
                  onClick={() => handleToggleJdUploadMode(true)}
                  className={`text-[12px] px-3 py-1 rounded-full border ${
                    isJdUploadMode
                      ? "bg-primary text-white border-primary"
                      : "text-slate-600 border-slate-300"
                  }`}
                >
                  Upload File
                </button>
              </div>

              {!isJdUploadMode ? (
                <textarea
                  className="input-box w-full min-h-[140px] resize-y"
                  value={jobDescription}
                  onChange={({ target }) => setJobDescription(target.value)}
                  placeholder="Paste the job description here..."
                />
              ) : (
                <div>
                  <label className="text-[13px] font-medium text-primary underline cursor-pointer">
                    {isExtracting ? "Reading file..." : "Choose File (.txt, .pdf, .docx)"}
                    <input
                      type="file"
                      accept=".txt,.pdf,.docx,text/plain,application/pdf,application/vnd.openxmlformats-officedocument.wordprocessingml.document"
                      className="hidden"
                      disabled={isExtracting}
                      onChange={handleJdFileChange}
                    />
                  </label>
                  {jdFileName && (
                    <p className="text-[12px] text-slate-500 mt-1">{jdFileName}</p>
                  )}
                  {jobDescription && (
                    <textarea
                      className="input-box w-full min-h-[140px] resize-y mt-2"
                      value={jobDescription}
                      onChange={({ target }) => setJobDescription(target.value)}
                    />
                  )}
                </div>
              )}
            </div>

            <Input
              value={formData.description}
              onChange={({ target }) =>
                handleChange("description", target.value)
              }
              label="Session Description (optional)"
              placeholder="(Any specific notes for the session)"
              type="text"
            />
          </>
        )}

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

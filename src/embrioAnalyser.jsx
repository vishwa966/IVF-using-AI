import React, { useState } from "react";
import axios from "axios";
import "./EmbryoAnalyzer.css";

const EmbryoAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);
  const [loading, setLoading] = useState(false); // ✅ Added loading state

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      alert("Please select an image first");
      return;
    }

    setLoading(true); // ✅ Show loading state

    const formData = new FormData();
    formData.append("image", selectedFile);

    const token = localStorage.getItem("token");

    try {
      const response = await axios.post("http://127.0.0.1:5000/analyze", formData, {
        headers: { 
          "Authorization": token,
          "Content-Type": "multipart/form-data"
        },
      });

      setPrediction(response.data.prediction);
      setConfidence(response.data.confidence);
    } catch (error) {
      console.error("Error uploading file: ", error);
      alert("Session expired. Please log in again.");
    } finally {
      setLoading(false); // ✅ Hide loading state
    }
  };

  return (
    <div className="container">
      <div className="card">
        <img src="https://thumbs.dreamstime.com/b/ivf-icon-background-graphic-web-design-simple-vector-sign-internet-concept-symbol-website-button-mobile-app-141017202.jpg" alt="IVF Analysis" className="banner" />
        <h1 className="title">Embryo Health Analyzer</h1>
        <p className="description">Upload an embryo image to analyze its health.</p>
        <input type="file" onChange={handleFileChange} className="file-input" />
        
        {/* ✅ Button with loader icon */}
        <button onClick={handleUpload} className="analyze-button" disabled={loading}>
          {loading ? (
            <>
              <span className="loader"></span> Analyzing...
            </>
          ) : (
            "Analyze"
          )}
        </button>

        {prediction && (
          <div className="result">
            <p className="result-text">Prediction: <span>{prediction}</span></p>
            {prediction === "Healthy" ? <p>It is suitable for IVF</p> : <p>It is not suitable for IVF</p>}
            <p className="result-text">Confidence: <span>{confidence.toFixed(2)}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbryoAnalyzer;

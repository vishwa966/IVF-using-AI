import React, { useState } from "react";
import axios from "axios";
import "./EmbryoAnalyzer.css";

const EmbryoAnalyzer = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prediction, setPrediction] = useState(null);
  const [confidence, setConfidence] = useState(null);

  const handleFileChange = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
        alert("Please select an image first");
        return;
    }

    const formData = new FormData();
    formData.append("image", selectedFile);

    const token = localStorage.getItem("token"); // ✅ Get JWT from localStorage

    try {
        const response = await axios.post("http://127.0.0.1:5000/analyze", formData, {
            headers: { 
                "Authorization": token,  // ✅ Send token in request
                "Content-Type": "multipart/form-data"
            },
        });

        setPrediction(response.data.prediction);
        setConfidence(response.data.confidence);
    } catch (error) {
        console.error("Error uploading file: ", error);
        alert("Session expired. Please log in again.");
    }
};


  return (
    <div className="container">
      <div className="card">
        <img src="https://thumbs.dreamstime.com/b/ivf-icon-background-graphic-web-design-simple-vector-sign-internet-concept-symbol-website-button-mobile-app-141017202.jpg" alt="IVF Analysis" className="banner" />
        <h1 className="title">Embryo Health Analyzer</h1>
        <p className="description">Upload an embryo image to analyze its health.</p>
        <input type="file" onChange={handleFileChange} className="file-input" />
        <button onClick={handleUpload} className="analyze-button">Analyze</button>
        {prediction && (
          <div className="result">
            <p className="result-text">Prediction: <span>{prediction}</span></p>
            {prediction==="Healthy"?<p>It is suitable for IVF</p>:<p>It is not suitable for IVf</p>}
            <p className="result-text">Confidence: <span>{confidence.toFixed(2)}</span></p>
          </div>
        )}
      </div>
    </div>
  );
};

export default EmbryoAnalyzer;

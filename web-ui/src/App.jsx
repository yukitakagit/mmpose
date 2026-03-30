import { useState, useRef } from 'react';
import './index.css';

function App() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef(null);

  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFileChange(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      handleFileChange(e.target.files[0]);
    }
  };

  const handleFileChange = (selectedFile) => {
    setFile(selectedFile);
    // Create local preview immediately
    const objectUrl = URL.createObjectURL(selectedFile);
    setPreview(objectUrl);
    setResult(null); // Reset prev results
  };

  const triggerSelect = () => {
    fileInputRef.current.click();
  };

  const handleUpload = async () => {
    if (!file) return;

    setLoading(true);
    const formData = new FormData();
    formData.append('file', file);

    try {
      // Connect to the FastAPI backend running on localhost:8000
      const response = await fetch('http://localhost:8000/api/predict', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      
      // Complete URL to access the image from FastAPI
      data.vis_url = `http://localhost:8000${data.vis_url}`;
      setResult(data);
    } catch (error) {
      console.error("Error during prediction:", error);
      alert("予測中にエラーが発生しました。サーバーが起動しているか確認してください。");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container">
      <header className="header">
        <h1>MMPose AI</h1>
        <p>高精度な骨格・姿勢推定をあなたのブラウザで</p>
      </header>

      <main>
        {!result && !loading && (
          <div className="glass-panel" style={{ textAlign: 'center' }}>
            <div 
              className={`upload-area ${dragActive ? "drag-active" : ""}`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              onClick={triggerSelect}
            >
              <input 
                ref={fileInputRef}
                type="file"
                accept="image/*,video/*"
                onChange={handleChange}
              />
              
              {preview ? (
                <img src={preview} alt="Preview" style={{ maxWidth: '100%', maxHeight: '100%', objectFit: 'contain' }} />
              ) : (
                <>
                  <div className="upload-icon">✦</div>
                  <h3 className="upload-text">クリックまたはドラッグ＆ドロップでアップロード</h3>
                  <p className="upload-subtext">JPG, PNG, または MP4形式に対応</p>
                </>
              )}
            </div>
            
            {file && (
              <button 
                className="btn" 
                onClick={handleUpload}
                style={{ marginTop: '2rem' }}
              >
                骨格推定を実行する
              </button>
            )}
          </div>
        )}

        {loading && (
          <div className="glass-panel loader-container">
            <div className="loader"></div>
            <h2>MMPoseが解析中です...</h2>
            <p className="upload-subtext">画像内の姿勢・骨格を検出しています</p>
          </div>
        )}

        {result && !loading && (
          <div className="glass-panel">
            <h2 style={{ marginBottom: '1.5rem', textAlign: 'center' }}>解析完了</h2>
            <div className="results-grid">
              <div className="result-image-container">
                {file.type.startsWith('video') ? (
                  <video src={result.vis_url} controls className="result-image" autoPlay loop muted />
                ) : (
                  <img src={result.vis_url} alt="Pose Estimation Result" className="result-image" />
                )}
              </div>
              <div className="json-container">
                <pre>{JSON.stringify(result.predictions, null, 2)}</pre>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '2rem' }}>
              <button className="btn" onClick={() => { setResult(null); setFile(null); setPreview(null); }}>
                新しい画像をアップロード
              </button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;

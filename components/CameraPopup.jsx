'use client';
import { useState, useRef } from 'react';
import { CiCamera } from "react-icons/ci";

export default function CameraPopup() {
  const [open, setOpen] = useState(false);
  const [captured, setCaptured] = useState(null);
  const [userName, setUserName] = useState('');
  const [carrier, setCarrier] = useState('');
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);

  const openCamera = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: true });
      videoRef.current.srcObject = stream;
    } catch (err) {
      alert('Camera access denied.');
    }
  };

  const takePhoto = () => {
    const canvas = canvasRef.current;
    const video = videoRef.current;
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const context = canvas.getContext('2d');
    context.drawImage(video, 0, 0);
    const imageData = canvas.toDataURL('image/png');
    setCaptured(imageData);

    // Close camera stream
    const tracks = videoRef.current.srcObject.getTracks();
    tracks.forEach(track => track.stop());
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!captured) {
      alert('Please take a photo first!');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const response = await fetch('/api/upload-photo', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          image: captured,
          userName: userName,
          carrier: carrier
        }),
      });
      
      if (response.ok) {
        setFormSubmitted(true);
        // Redirect to photo page
        window.location.href = '/photo';
      } else {
        throw new Error('Failed to upload');
      }
    } catch (error) {
      alert('Error submitting form. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md  mx-auto mt-10 p-6 rounded-xl shadow-2xl">
      <h1 className="text-3xl font-bold text-center text-white mb-6">Amazing Photo Capture</h1>
      
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
              <option value="" className="text-gray-800">Select Your Carrier</option>
              <option value="AT&T" className="text-gray-800">AT&T</option>
              <option value="Verizon" className="text-gray-800">Verizon</option>
              <option value="T-Mobile" className="text-gray-800">T-Mobile</option>
              <option value="Sprint" className="text-gray-800">Sprint</option>
              <option value="Other" className="text-gray-800">Other</option>
            </select>
          </div>
        </div>
        
        {captured ? (
          <div className="relative">
            <img 
              src={captured} 
              alt="Captured" 
              className="w-full h-64 object-cover rounded-lg border-4 border-white/50 shadow-lg" 
            />
            <button
              type="button"
              onClick={() => {
                setCaptured(null);
                setOpen(true);
                openCamera();
              }}
              className="absolute bottom-3 right-3 bg-red-500 hover:bg-red-600 text-white p-2 rounded-full shadow-lg transition-all"
            >
              Retake
            </button>
          </div>
        ) : (
          <button
            type="button"
            className="w-full group overflow-hidden relative bg-white/20 backdrop-blur-sm hover:bg-white/30 text-white font-bold py-4 px-4 rounded-lg border-2 border-white/40 flex items-center justify-center transition-all"
            onClick={() => {
              setOpen(true);
              openCamera();
            }}
          >
            <CiCamera size={24} className="mr-2" />
            <span className="text-lg">Capture Your Amazing Photo</span>
            <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-all duration-700 ease-in-out" />
          </button>
        )}
        
        <button
          type="submit"
          disabled={isLoading || !captured || !userName || !carrier}
          className={`w-full py-4 px-6 rounded-lg text-white font-bold text-lg shadow-lg transform hover:scale-105 transition-all ${
            isLoading || !captured || !userName || !carrier
              ? 'bg-gray-400 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Processing...
            </span>
          ) : (
            'Submit & See Magic ✨'
          )}
        </button>
      </form>
      
      {open && (
        <div className="fixed inset-0 bg-black/90 flex justify-center items-center z-50">
          <div className="bg-gray-900 p-6 rounded-xl shadow-2xl border border-purple-500 max-w-md w-full">
            <h2 className="text-xl font-bold text-center text-white mb-4">Capture Your Best Moment</h2>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full h-64 object-cover rounded-lg border-2 border-purple-500"
            />
            <canvas ref={canvasRef} className="hidden" />
            <div className="flex justify-between gap-4 mt-4">
              <button
                onClick={takePhoto}
                className="flex-1 bg-gradient-to-r from-green-400 to-blue-500 hover:from-green-500 hover:to-blue-600 text-white font-semibold py-3 px-4 rounded-lg transform hover:scale-105 transition-all flex items-center justify-center"
              >
                <CiCamera  size={20} className="mr-2" />
                Take Photo
              </button>
              <button
                onClick={() => setOpen(false)}
                className="flex-1 bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-semibold py-3 px-4 rounded-lg transform hover:scale-105 transition-all"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
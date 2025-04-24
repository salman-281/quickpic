'use client'
import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import { FaGithub, FaLinkedin, FaTwitter } from 'react-icons/fa'

const ViewPhoto = () => {
  const [pics, setPics] = useState([]);

  const fetchData = async () => {
    try {
      const res = await fetch('/api/upload-photo');
      const data = await res.json();
      setPics(data.photos); // Ensure this is an array of { image: 'url' }
    } catch (error) {
      console.error('Failed to fetch photos:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  console.log("pics",pics)

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-100 to-white flex flex-wrap justify-center items-start gap-10 p-10">
      {pics.length > 0 ? (
        pics.map((pic, index) => (
          <div
            key={index}
            className="w-[340px] group backdrop-blur-xl bg-white/40 border border-white/20 rounded-2xl shadow-2xl p-6 "
          >
            <div className="relative w-full flex justify-center">
              <div className="rounded-full p-1 bg-white">
                <Image
                  className="rounded-lg"
                  src={pic.image}
                  width={500}
                  height={500}
                  alt={`Photo ${index}`}
                />
              </div>
            </div>

            <div className="mt-6 text-center">
              <h1 className="text-2xl font-bold text-indigo-900 drop-shadow-sm">{pic.userName}</h1>
              <h2 className="text-sm font-medium text-gray-700">
                {pic.carrier}
                <a
                  href="#"
                  className="text-indigo-700 hover:text-indigo-500 underline decoration-indigo-300 hover:decoration-4 transition-all"
                >
                  XYZ
                </a>
              </h2>
            </div>

            <div className="mt-4 flex justify-center gap-6 text-2xl">
              <a href="#" className="text-indigo-700 hover:text-indigo-400 transition-all">
                <FaGithub />
              </a>
              <a href="#" className="text-indigo-700 hover:text-indigo-400 transition-all">
                <FaLinkedin />
              </a>
              <a href="#" className="text-indigo-700 hover:text-indigo-400 transition-all">
                <FaTwitter />
              </a>
            </div>
          </div>
        ))
      ) : (
        <p className='text-gray-700 animate-bounce'>Loading, please wait...</p>
      )}
    </div>
  );
};

export default ViewPhoto;

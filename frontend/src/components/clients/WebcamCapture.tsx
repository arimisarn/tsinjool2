import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Camera, CameraOff } from "lucide-react";

interface WebcamCaptureProps {
  onVideoReady: (video: HTMLVideoElement) => void;
  isActive: boolean;
  onToggle: () => void;
}

export const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onVideoReady,
  isActive,
  onToggle,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (isActive) {
      startWebcam();
    } else {
      stopWebcam();
    }

    return () => stopWebcam();
  }, [isActive]);

  const startWebcam = async () => {
    try {
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: { width: 640, height: 480 },
        audio: false,
      });

      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
        videoRef.current.onloadedmetadata = () => {
          videoRef.current?.play();
          onVideoReady(videoRef.current!);
        };
      }

      setStream(mediaStream);
      setError(null);
    } catch (err) {
      setError("Impossible d'accéder à la caméra");
      console.error("Erreur webcam:", err);
    }
  };

  const stopWebcam = () => {
    if (stream) {
      stream.getTracks().forEach((track) => track.stop());
      setStream(null);
    }
  };

  return (
    <div className="relative">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative bg-white/10 backdrop-blur-md rounded-2xl p-6 border border-white/20"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-xl font-semibold text-white">Caméra</h3>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={onToggle}
            className={`p-3 rounded-full transition-all ${
              isActive
                ? "bg-red-500 hover:bg-red-600"
                : "bg-green-500 hover:bg-green-600"
            }`}
          >
            {isActive ? <CameraOff size={20} /> : <Camera size={20} />}
          </motion.button>
        </div>

        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            muted
            playsInline
            className="w-full h-64 bg-gray-800 rounded-lg object-cover"
          />

          {error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
              <div className="text-center text-white">
                <CameraOff size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">{error}</p>
              </div>
            </div>
          )}

          {!isActive && !error && (
            <div className="absolute inset-0 flex items-center justify-center bg-gray-800 rounded-lg">
              <div className="text-center text-white">
                <Camera size={48} className="mx-auto mb-2 opacity-50" />
                <p className="text-sm">Caméra désactivée</p>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};

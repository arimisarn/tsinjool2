import { useEffect, useRef } from "react";

const CoachVisuel = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);

  useEffect(() => {
    const startCamera = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        console.error("Erreur accès caméra :", err);
      }
    };

    startCamera();
  }, []);

  return (
    <div className="p-6 text-center text-gray-900 dark:text-white">
      <h1 className="text-3xl font-bold mb-4">SenseAI – Coach Visuel</h1>
      <p className="mb-4">L’IA observe vos expressions pour mieux vous guider.</p>
      <div className="flex justify-center">
        <video ref={videoRef} autoPlay className="rounded-lg shadow-xl w-full max-w-md" />
      </div>
    </div>
  );
};

export default CoachVisuel;

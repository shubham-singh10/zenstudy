import { useEffect, useRef } from "react";
import shaka from "shaka-player";

export const VideoPlayer = ({ videopath, thumbnailUrl }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const loadShaka = async () => {
      try {
        if (!videoRef.current) {
          console.error("Video element not found!");
          return;
        }

        // Initialize Shaka
        shaka.polyfill.installAll();

        if (!shaka.Player.isBrowserSupported()) {
          console.error("Shaka Player is not supported on this browser.");
          return;
        }

        const response = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/course/get-signed-url?videoPath=${videopath}`
        );
        const data = await response.json();
        console.log("Response:", data);
        const fetchedManifestUrl = data.signedUrl;

        if (!fetchedManifestUrl) {
          console.error("Failed to get signed URL for video.");
          return;
        }

        const player = new shaka.Player(videoRef.current);
        playerRef.current = player;

        // Optional: you can add error event listener
        // player.addEventListener("error", (event) => {
        //   console.error("Shaka Player error:", event.detail);
        // });

        await player.load(fetchedManifestUrl);
      } catch (err) {
        console.error("Failed to load Shaka Player or fetch signed URL:", err);
      }
    };

    loadShaka();

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [videopath]);

  return (
    <video
      ref={videoRef}
      controls
      // autoPlay
      className="w-full h-full rounded-lg"
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      // poster={thumbnailUrl}
    />
  );
};

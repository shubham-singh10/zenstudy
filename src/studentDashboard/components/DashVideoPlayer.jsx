import { useEffect, useRef } from "react";
import shaka from "shaka-player";

export const DashVideoPlayer = ({ videopath, thumbnailUrl }) => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    const loadShaka = async () => {
      try {
        if (!videoRef.current) {
          console.error("❌ Video element not found");
          return;
        }

        shaka.polyfill.installAll();

        if (!shaka.Player.isBrowserSupported()) {
          console.error("❌ Shaka Player not supported in this browser");
          return;
        }

        // Step 1: Set signed cookies for the folder path
        const cookieResponse = await fetch(
          `${process.env.REACT_APP_API}/zenstudy/api/course/get-signed-url?videoPath=${encodeURIComponent(videopath)}`,
          { credentials: "include" }
        );

        if (!cookieResponse.ok) {
          throw new Error(`Cookie error: ${cookieResponse.statusText}`);
        }

        // Step 2: Initialize Shaka Player
        const player = new shaka.Player(videoRef.current);
        playerRef.current = player;

        // Optional: listen for errors
        player.addEventListener("error", (event) => {
          console.error("📛 Shaka Player error:", event.detail);
        });

        // Step 3: Load the manifest
        const manifestUrl = `https://${process.env.REACT_APP_API}/${videopath}/index.m3u8`;

        await player.load(manifestUrl);
        console.log("✅ Video loaded successfully");
      } catch (error) {
        console.error("🚫 Error loading Shaka Player:", error);
      }
    };

    loadShaka();

    return () => {
      playerRef.current?.destroy();
    };
  }, [videopath]);

  return (
    <video
      ref={videoRef}
      controls
      autoPlay
      className="w-full h-full rounded-lg"
      controlsList="nodownload"
      onContextMenu={(e) => e.preventDefault()}
      poster={thumbnailUrl}
    />
  );
};

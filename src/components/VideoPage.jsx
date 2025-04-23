import React, { useEffect, useRef } from 'react';
import shaka from 'shaka-player';

const ShakaPlayerComponent = () => {
  const videoRef = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    shaka.polyfill.installAll();

    if (shaka.Player.isBrowserSupported()) {
      const video = videoRef.current;
      const player = new shaka.Player(video);

      playerRef.current = player;

      player.addEventListener('error', (e) => {
        console.error('Shaka Player Error:', e.detail);
      });

      // Test with demo URL
      player
        .load('https://storage.googleapis.com/shaka-demo-assets/angel-one/dash.mpd')
        .then(() => console.log('The video has been loaded!'))
        .catch((e) => console.error('Error loading video:', e));
    } else {
      console.error('Browser not supported!');
    }

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, []);

  return (
    <div className='video-container' style={{ maxWidth: '800px', margin: '0 auto' }}>
      <video
        ref={videoRef}
        width="100%"
        controls
        autoPlay
        muted
        style={{ maxWidth: '100%', borderRadius: '8px' }}
      />
    </div>
  );
};

export default ShakaPlayerComponent;

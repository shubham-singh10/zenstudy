import React, { useEffect } from 'react';
import { ZoomMtg } from '@zoomus/websdk';
import "./main.css"
const ZoomMeeting = ({ signature, meetingNumber, password, userName }) => {

  useEffect(() => {
    const meetingSDKElement = document.getElementById("meetingSDKElement");

    ZoomMtg.init({
      leaveUrl: 'YOUR_LEAVE_URL',
      isSupportAV: true,
      success: () => {
        ZoomMtg.join({
          signature,
          meetingNumber,
          userName,
          password,
          success: (res) => {
            console.log('Join meeting success', res);

            // Ensure the Zoom container fills the screen
            meetingSDKElement.style.width = "100vw";
            meetingSDKElement.style.height = "100vh";

            // Force full screen
            if (meetingSDKElement.requestFullscreen) {
              meetingSDKElement.requestFullscreen();
            } else if (meetingSDKElement.mozRequestFullScreen) { /* Firefox */
              meetingSDKElement.mozRequestFullScreen();
            } else if (meetingSDKElement.webkitRequestFullscreen) { /* Chrome, Safari and Opera */
              meetingSDKElement.webkitRequestFullscreen();
            } else if (meetingSDKElement.msRequestFullscreen) { /* IE/Edge */
              meetingSDKElement.msRequestFullscreen();
            }
          },
          error: (err) => {
            console.error('Error joining meeting', err);
          }
        });
      },
      error: (err) => {
        console.error('Error initializing Zoom', err);
      }
    });

  }, [signature, meetingNumber, password, userName]);

  return (
    <div id="meetingSDKElement">
      {/* The Zoom SDK will automatically populate this div */}
    </div>
  );
}

export default ZoomMeeting;

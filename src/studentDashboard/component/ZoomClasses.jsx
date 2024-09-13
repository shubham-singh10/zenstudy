import React, { useState } from "react";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";
import { ZoomMtg } from '@zoom/meetingsdk';
import "./main.css";

ZoomMtg.preLoadWasm();
ZoomMtg.prepareWebSDK();

function ZoomClasses() {
  const [formData, setFormData] = useState({
    meetingNumber: "",
    password: "",
    userId: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API}zenstudy/api/meeting/join`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetingNumber: formData.meetingNumber }),
      });

      if (response.status === 204) {
        console.log("No meeting found for this meeting number.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Network response was not ok. Status code: ${response.status}`);
      }

      const data = await response.json();
      if (data.meetingData) {
        let jdata = data.meetingData;

        // Add participant to the meeting
        const participantResponse = await fetch(
          `${process.env.REACT_APP_API}zenstudy/api/meeting/addParticipant`,
          {
            method: "POST",
            headers: {
              Accept: "application/json",
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ meetingId: jdata._id, participantsuser: formData.userId }),
          }
        );

        if (!participantResponse.ok) {
          throw new Error(`Failed to add participant. Status code: ${participantResponse.status}`);
        }
        const participant = await participantResponse.json();
        console.log("Participant", participant.participantName)
        startMeeting(jdata.signature, jdata.meetingNumber, jdata.password, participant.participantName);
      }
    } catch (error) {
      console.error("Error joining meeting:", error);
    } finally {
      setLoading(false);
    }
  };
  
  var userEmail = ''
  var registrantToken = ''
  var zakToken = ''
  const startMeeting = (signature, meetingNumber, password, username) => {
    document.getElementById('zmmtg-root').style.display = 'block';

    console.log("Starting meeting with details:", {
      signature,
      meetingNumber,
      password,
      userName: username
    });

    
    ZoomMtg.init({
      leaveUrl: 'https://zenstudy-delta.vercel.app/',
      patchJsMedia: true,
      leaveOnPageUnload: true,
      success: (success) => {
        console.log(success)

        ZoomMtg.join({
          signature: signature,
          sdkKey: process.env.REACT_APP_ZOOM_SDK_KEY,
          meetingNumber: meetingNumber,
          passWord: password,
          userName: username,
          userEmail: userEmail,
          tk: registrantToken,
          zak: zakToken,
          success: (success) => {
            console.log(success)
          },
          error: (error) => {
            console.log(error)
          }
        })

      },
      error: (error) => {
        console.log(error)
      }
    })
  };

  return (
    <div className="container mx-auto p-4 flex flex-col items-center gap-4">
      <div className="App">
        <main>
          <h1>Join Meet</h1>
          <form className="space-y-4" onSubmit={onSubmit}>
            <Box
              sx={{ "& > :not(style)": { m: 1 } }}
              noValidate
              autoComplete="off"
            >
              <TextField
                className="w-full"
                name="meetingNumber"
                label="Enter Meeting"
                value={formData.meetingNumber}
                onChange={handleChange}
                variant="outlined"
              />
              <TextField
                className="w-full"
                name="userId"
                value={formData.userId}
                onChange={handleChange}
                label="Enter UserId"
                variant="outlined"
              />
            </Box>
            <button
              type="submit"
              className="bg-blue-600 text-white py-2 px-4 rounded-md"
              disabled={loading}
            >
              {loading ? "Please wait..." : "Join Meet"}
            </button>
          </form>
          <div id="zmmtg-root">
            {/* Zoom Meeting SDK Component View Rendered Here */}
          </div>
        </main>
      </div>
    </div>
  );
}

export default ZoomClasses;

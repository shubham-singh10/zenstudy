import React, { useState } from "react";
import ZoomMtgEmbedded from "@zoom/meetingsdk/embedded";
import Box from "@mui/material/Box";
import TextField from "@mui/material/TextField";

function ZoomClassesNew() {
  const [formData, setFormData] = useState({
    meetingNumber: "",
    passowrd: "",
    userId: "",
    courseId: "",
  });
  const [Loading, setLoading] = useState(false);

  const client = ZoomMtgEmbedded.createClient();

  // var authEndpoint = "http:localhost:4000";
  var sdkKey = "nibV3hlUQzZSR7ge3HWMw";

  function startMeeting(signature, meetingNumber, passWord, username) {
    let meetingSDKElement = document.getElementById("meetingSDKElement");
     console.log("Signature", signature);
    // console.log("meetingNumber", meetingNumber);
    // console.log("Password", passWord);
    // console.log("userName", username);

    client.init({
      zoomAppRoot: meetingSDKElement,
      language: "en-US",
      patchJsMedia: true,
      leaveOnPageUnload: true,
    }).then(() => {
      client.join({
        signature: signature,
        sdkKey: sdkKey,
        meetingNumber: Number(meetingNumber),
        password: Number(passWord),
        userName: username
      }).then(() => {
        console.log("Joined meeting successfully");
      }).catch((error) => {
        console.error("Error joining meeting:", error);
      });
    }).catch((error) => {
      console.error("Error initializing Zoom SDK", error);
    });
  }

  // Handle form change
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  }
  const onSubmit = async (e) => {
    e.preventDefault();
    console.log("formData", formData);
    setLoading(true);

    try {
      const response = await fetch(`${process.env.REACT_APP_API2}zenstudy/api/meeting/join`, {
        method: "POST",
        headers: {
          Accept: "application/json",
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ meetingNumber: formData.meetingNumber }),
      });

      // Handle the case where no content is returned
      if (response.status === 204) {
        console.log("No meeting found for this meeting number.");
        return;
      }

      if (!response.ok) {
        throw new Error(`Network response was not ok. Status code: ${response.status}`);
      }

      // Parse the response data
      const data = await response.json();
      console.log("Meeting_Data", data.meetingData);

      if (data.meetingData) {
        let jdata = data.meetingData;

        // Add participant to the meeting
        const participantResponse = await fetch(
          `${process.env.REACT_APP_API2}zenstudy/api/meeting/addParticipant`,
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
      setLoading(false); // Reset the loading state in both success and failure scenarios
    }
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
                id="outlined-basic"
                name="meetingNumber"
                label="Enter Meeting"
                value={formData.meetingNumber}
                onChange={handleChange}
                variant="outlined"
              />

              <TextField
                className="w-full"
                id="outlined-basic"
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
              disabled={Loading}
            >
              {Loading ? "Please wait..." : "Join Meet"}
            </button>
          </form>
          {/* For Component View */}
          <div id="meetingSDKElement">
            {/* Zoom Meeting SDK Component View Rendered Here */}
          </div>

          {/* <button onClick={getSignature}>Join Meeting</button> */}
        </main>
      </div>
    </div>
  );
};


export default ZoomClassesNew;
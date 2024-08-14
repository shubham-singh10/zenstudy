import React, { useCallback, useEffect, useState } from "react";

function Images({ thumbnail , className}) {
  const [imageData, setImageData] = useState(null);
  const [error, setError] = useState(null);
    console.log(thumbnail)
  const getThumbnail = useCallback(async () => {
    if (!thumbnail) return; // Check if thumbnail is provided

    try {
      const response = await fetch(
        `${process.env.REACT_APP_API}/zenstudy/api/image/getimage/${thumbnail}`,
        {
          method: "GET",
          headers: {
            Accept: "application/json",
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(`Error: ${response.statusText}`);
      }

      const blob = await response.blob(); 
      const url = URL.createObjectURL(blob); 
      setImageData(url); 

    } catch (error) {
      console.log("Error:", error.message);
      setError("Failed to load image");
    }
  }, [thumbnail]);

  useEffect(() => {
    getThumbnail();
  }, [getThumbnail]);

  return (
    <div>
      {error && <p className="text-red-500">{error}</p>}
      {imageData ? (
        <img src={imageData} alt="Thumbnail"  className={className}/> 
      ) : (
        <p>Loading...</p>
      )}
    </div>
  );
}

export default Images;

import React, { useState } from 'react'
import { FiUpload } from 'react-icons/fi'
import { TextField, Button } from '@mui/material'

const Profile = () => {
    const [image, setImage] = useState('https://i.ibb.co/GcKk9fh/images-2.jpg');
    const [imageFile, setImageFile] = useState(null);

    const useerData = localStorage.getItem("userData")
    if(useerData){
        const pdata = JSON.parse(useerData)
        console.log("LocalData", pdata)
    }
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setImageFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };
    return (
        
          <form className="w-full mx-auto p-4 space-y-4">
            <div className="flex flex-col items-center mt-0"> {/* Removed top margin */}
                <img src={image} alt="Profile" className="rounded-full w-44 mb-4" />
                <label className="flex bg-[#054BB4] text-white w-full md:w-1/3 items-center justify-center py-2 cursor-pointer">
                    <input
                        type="file"
                        className="hidden"
                        onChange={handleImageChange}
                    />
                    <span className="px-4">Choose File</span>
                    <FiUpload className="text-2xl" />
                </label>
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
            <TextField
                label="Name"
                variant="outlined"
                fullWidth
            />
            <TextField
                label="Email"
                variant="outlined"
                fullWidth
            />
            </div>
            <TextField
                label="Phone"
                variant="outlined"
                fullWidth
                disabled
            />
            <TextField
                label="Address"
                variant="outlined"
                fullWidth
            />
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <TextField
                    label="City"
                    variant="outlined"
                    className="w-full md:w-1/2"
                />
                <TextField
                    label="State"
                    variant="outlined"
                    className="w-full md:w-1/2"
                />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <TextField
                    label="Country"
                    variant="outlined"
                    className="w-full md:w-1/2"
                />
                <TextField
                    label="Pincode"
                    variant="outlined"
                    className="w-full md:w-1/2"
                />
            </div>
            <div className="flex justify-end">
                <Button variant="contained" color="primary">
                    Save
                </Button>
            </div>
        </form>
        
    )
}

export default Profile
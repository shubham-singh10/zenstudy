import React, { useEffect, useState } from 'react';
import { FiUpload } from 'react-icons/fi';
import { TextField, Button } from '@mui/material';
import Swal from 'sweetalert2';
import Cookies from 'js-cookie';// Add this package

const Profile = () => {
    const [userData, setUserData] = useState({
        name: '',
        email: '',
        phone: '',
        Address: '',
        City: '',
        State: '',
        Country: '',
        Pincode: '',
        avatar: ""
    });
    const [image, setImage] = useState('https://i.ibb.co/GcKk9fh/images-2.jpg');
    const [loading, setLoading] = useState(false);
    const token = Cookies.get("access_tokennew");
    let userId = null;

    if (token) {
        try {
            userId = token;
        } catch (error) {
            console.error('Error decoding token:', error);
        }
    }

    // Handel Image Update
    const handleImageChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setImage(reader.result);
            };
            reader.readAsDataURL(file);
        }
    };

    //Get User Data API
    const getUserData = async (userId) => {
        try {
            const response = await fetch(
                `${process.env.REACT_APP_API}zenstudy/api/user/userdetail/${userId}`,
                {
                    method: "GET",
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Failed to fetch user data");
            }
            const resData = await response.json();
            ////console.log("User_ProfileData", resData)
            setUserData(resData.userdetail || {});
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Error: ${error.message}`,
            });
        }
    };

    // Update User API 
    const submitData = async () => {
        if (!userId) return;

        setLoading(true);
        // //console.log("User_Data", userData)
        try {
            const response = await fetch(`${process.env.REACT_APP_API}zenstudy/api/user/updatenew/${userId}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(userData)
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || 'Failed to update user');
            }
            const resData = await response.json()
            // //console.log("Response_Data", resData)
            if (resData.message === "Success") {
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'User updated successfully',
                });
            }

        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: `Error: User update failed.`,
            });
        } finally {
            setLoading(false);
        }
    };

    //User for set Image
    useEffect(() => {
        if (userData?.avatar) {
            setImage(userData.avatar);
        }
    }, [userData])

    //Call getUser Data
    useEffect(() => {
        if (userId) {
            getUserData(userId);
        }
    }, [userId]);

    return (
        <form className="w-full mx-auto p-4 space-y-4" onSubmit={(e) => e.preventDefault()}>
            <div className="flex flex-col items-center mt-0">
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
                    value={userData.name || ''}
                    fullWidth
                    onChange={(e) => setUserData(prev => ({ ...prev, name: e.target.value }))}
                />
                <TextField
                    label="Email"
                    variant="outlined"
                    value={userData.email || ''}
                    fullWidth
                    onChange={(e) => setUserData(prev => ({ ...prev, email: e.target.value }))}
                />
            </div>
            <TextField
                label="Phone"
                variant="outlined"
                value={userData.phone || ''}
                fullWidth
                disabled
            />
            <TextField
                label="Address"
                variant="outlined"
                value={userData.Address || ''}
                fullWidth
                onChange={(e) => setUserData(prev => ({ ...prev, Address: e.target.value }))}
            />
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <TextField
                    label="City"
                    variant="outlined"
                    value={userData.City || ''}
                    className="w-full md:w-1/2"
                    onChange={(e) => setUserData(prev => ({ ...prev, City: e.target.value }))}
                />
                <TextField
                    label="State"
                    variant="outlined"
                    value={userData.State || ''}
                    className="w-full md:w-1/2"
                    onChange={(e) => setUserData(prev => ({ ...prev, State: e.target.value }))}
                />
            </div>
            <div className="flex flex-col md:flex-row md:space-x-4 space-y-4 md:space-y-0">
                <TextField
                    label="Country"
                    variant="outlined"
                    value={userData.Country || ''}
                    className="w-full md:w-1/2"
                    onChange={(e) => setUserData(prev => ({ ...prev, Country: e.target.value }))}
                />
                <TextField
                    label="Pincode"
                    variant="outlined"
                    value={userData.Pincode || ''}
                    className="w-full md:w-1/2"
                    onChange={(e) => setUserData(prev => ({ ...prev, Pincode: e.target.value }))}
                />
            </div>
            <div className="flex justify-end">
                <Button
                    variant="contained"
                    color="primary"
                    onClick={submitData}
                    disabled={loading}
                >
                    {loading ? 'Updating...' : 'Update'}
                </Button>
            </div>
        </form>
    );
};

export default Profile;

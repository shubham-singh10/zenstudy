import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import { Box, TextField, InputAdornment } from '@mui/material'
import { Link, useNavigate } from 'react-router-dom';
import { MdPhone } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import Swal from 'sweetalert2';


const SignIn = () => {
    const [loading, setloading] = useState(false)
    const [showPassword, setShowPassword] = useState(false)
    const { register, handleSubmit, formState: { errors } } = useForm()
    const navigate = useNavigate()

    //SignIn APi call and navigate
    const OnSubmit = async (data) => {
        try {
            setloading(true)
            const sendData = {
                phone: data.phone,
                password: data.password
            }
            const response = await fetch(
                `${process.env.REACT_APP_API2}zenstudy/api/auth/signin`,
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(sendData)
                }
            );
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.message || "Login failed");
            }
            const resData = await response.json();
            // console.log("ResData", resData)
            Swal.fire({
                icon: "success",
                title: "Login Successful",
                text: `Welcome back, ${resData.name}! You are now logged in.`,
            }).then(() => {
                Swal.fire({
                    icon: "info",
                    title: "Page Under Development",
                    text: "The login page is currently under development. We apologize for any inconvenience caused.",
                });
            });
            setloading(false)
            //localStorage.setItem("userData", JSON.stringify(resData));

        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Login failed: ${error.message}`,
            });
            setloading(false)
        }
    }

    return (
        <div className='p-2 lg:p-12 md:p-10'>
            <div className="flex flex-col items-center lg:flex-row-reverse p-4 lg:p-12 bg-white gap-10 w-full">
                <div className=" bg-blue-600 text-center text-white p-4 lg:p-16 rounded-3xl lg:w-1/4 w-full">
                    <h1 className="text-3xl font-bold mb-4">Welcome to ZenStudy</h1>
                    <h3 className="text-2xl font-bold mb-4">Connect with us</h3>
                    <div className="flex space-x-4 justify-center">
                        <Link href="#" className="hover:bg-red-500 rounded-full p-2"><FiYoutube size={25} className='hover:text-white' /></Link>
                        <Link href="#" className="hover:bg-gradient-to-br from-[#405DE6] via-[#5B51D8] to-[#E1306C] rounded-full p-2"><FiInstagram size={25} className='hover:text-white' /></Link>
                        <Link href="#" className="hover:bg-[#4267B2] rounded-full p-2"><FiFacebook size={25} className='hover:text-white' /></Link>
                        <Link href="#" className="hover:bg-[#1DA1F2] rounded-full p-2"><FiTwitter size={25} className='hover:text-white' /></Link>
                    </div>
                </div>
                <div className="flex-1 p-8 lg:w-3/4 w-full ">
                    <h2 className="text-3xl font-bold mb-4 text-blue-600 text-end">SignIn</h2>
                    <form className="space-y-4" onSubmit={handleSubmit(OnSubmit)}>
                        <Box sx={{ '& > :not(style)': { m: 1 }, }}>
                            <TextField
                                className='w-full'
                                id="phone"
                                label="Enter Your Phone No."
                                variant="outlined"
                                {...register("phone", {
                                    required: "Phone is required",
                                    minLength: { value: 10, message: "Phone number must be 10 digits" },
                                    maxLength: { value: 10, message: "Phone number must be 10 digits" },
                                    pattern: { value: /^\d{10}$/, message: "Phone number must be numeric" }
                                })}
                                error={!!errors.phone}
                                helperText={errors.phone ? errors.phone.message : ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <MdPhone size={25} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                className='w-full'
                                id="password"
                                label="Enter Your Password"
                                variant="outlined"
                                type={showPassword ? 'text' : 'password'}
                                {...register("password", { required: "Password is required" })}
                                error={!!errors.password}
                                helperText={errors.password ? errors.password.message : ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            {showPassword ?
                                                <FiEye className='cursor-pointer' size={25} onClick={() => setShowPassword(false)} /> :
                                                <FiEyeOff className='cursor-pointer' size={25} onClick={() => setShowPassword(true)} />
                                            }
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <p className='text-end'><Link to="/reset-password" className='hover:text-red-600 hover:underline'>Forgot Password ?</Link></p>
                        <div className='flex justify-between'>
                            <p>New User? <Link to="/sign-up" className='underline text-blue-500 hover:text-blue-700'>SignUp</Link></p>
                            {loading ? (
                                <button disabled className="bg-red-600 text-white py-2 px-10 rounded-full">Please wait...</button>
                            ) : (
                                <button type="submit" className="bg-blue-600 text-white py-2 px-10 rounded-full hover:bg-blue-800">Submit</button>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
};




export default SignIn;
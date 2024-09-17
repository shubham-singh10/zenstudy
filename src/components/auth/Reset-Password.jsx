import React, { useState } from 'react'
import { Box, TextField, InputAdornment } from '@mui/material'
import { useNavigate } from 'react-router-dom';
import { MdPhone } from 'react-icons/md';
import { useForm } from 'react-hook-form';
import { FiEye, FiEyeOff } from 'react-icons/fi';
import { firebase } from '../../Firebase';
import {
    getAuth,
    signInWithCredential,
    PhoneAuthProvider,
} from "firebase/auth";
import Swal from 'sweetalert2';

const ResetPassword = () => {
    const [formData, setFormData] = useState({
        phone: "",
        password: "",
        cpassword: ""
    })
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false)
    const [showCPassword, setShowCPassword] = useState(false)
    const [showotpForm, setShowOtpForm] = useState(false)
    const [timer, setTimer] = useState(40);
    const [loading, setLoading] = useState(false);
    const [otploading, setotpLoading] = useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const [otpError, setOtpError] = useState("")
    const { register, handleSubmit, formState: { errors }, watch } = useForm()
    const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 } } = useForm()
    const navigate = useNavigate()

    const password = watch("password")

    //Handle OTP Sent to firebase
    const handlePhoneNumberAuth = async (phoneNumber) => {
        try {
            // Check if recaptchaVerifier is already initialized
            if (!window.recaptchaVerifier) {
                window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
                    size: 'invisible',
                    callback: () => {
                        //console.log('Recaptcha verified');
                    },
                });
            }

            const appVerifier = window.recaptchaVerifier;
            const confirmationResult = await firebase.auth().signInWithPhoneNumber(phoneNumber, appVerifier);
            setVerificationId(confirmationResult.verificationId);
            setShowOtpForm(true);
            startTimer();
            Swal.fire({
                icon: 'success',
                title: 'OTP Sent',
                text: `OTP has been sent to ${phoneNumber}`,
            });
        } catch (error) {
            console.error('Error sending OTP:', error);
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: 'Failed to send OTP. Please try again.',
            });
        }
    };

    //called Otp Send function and User Verification code
    const OnSubmit = async (data) => {
        setLoading(true)
        setFormData(data);
        try {
            const sendData = {
                phone: data.phone,
            }
            const response = await fetch(
                `${process.env.REACT_APP_API}zenstudy/api/auth/user-check`,
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
                throw new Error(errorData.message || "Reset failed");
            }
            const resData = await response.json();
            ////console.log("ResData", resData)
            if (resData.message === "Success") {
                await handlePhoneNumberAuth(`+91${data.phone}`);

            }
        } catch (error) {
            Swal.fire({
                icon: "error",
                title: "Password Reset Error",
                text: `An error occurred while trying to reset your password. Please try again. Error: ${error.message}`,
            });
            setLoading(true)

        }

    }

    //Resend OTP Timer 40 sec
    const startTimer = () => {
        setOtpSent(true);
        const interval = setInterval(() => {
            setTimer((prevTimer) => {
                if (prevTimer === 0) {
                    clearInterval(interval);
                    setOtpSent(false);
                    setTimer(40);
                    return prevTimer;
                }
                return prevTimer - 1;
            });
        }, 1000);
    };

    //OTP Verification and user password reset API call
    const OnSubmitOTP = async (data) => {
        try {
            // Verify OTP
            setotpLoading(true)
            const auth = getAuth();
            const credential = PhoneAuthProvider.credential(verificationId, data.otp)
            await signInWithCredential(auth, credential);

            // Destructure formData
            const { phone, password } = formData;

            const sendData = { phone, password };

            // Send user data to your backend
            const response = await fetch(
                `${process.env.REACT_APP_API}zenstudy/api/auth/forget`,
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
                throw new Error(errorData.message || "Reset password failed");
            }

            const resData = await response.json();
            //console.log("ResData", resData);

            if (resData.message === "Password updated successfully") {
                Swal.fire({
                    icon: "success",
                    title: "Password Reset Successful!",
                    text: `Your password has been successfully reset. Please proceed to log in and start exploring ZenStudy.`,
                });
                navigate("/sign-In");
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtpError("Invalid OTP. Please try again.");
            setotpLoading(false)
            // Show SweetAlert error notification for registration failure
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Registration failed: Invalid OTP. Please try again.`,
            });
        }
    };

    //Used to resent OTP
    const resendOtp = async () => {
        await handlePhoneNumberAuth(`+91${formData.phone}`);
    };

    return (
        <div className='p-0 lg:p-12 md:p-10'>
            <div id="recaptcha-container"></div>
            <div className="flex flex-col items-center lg:flex-row-reverse p-4 lg:p-12 bg-white gap-10 w-full">
                <div className=" bg-blue-600 text-center text-white p-4 lg:p-16 rounded-3xl lg:w-1/4 w-full">
                    <h1 className="text-4xl font-bold mb-4">Welcome to ZenStudy</h1>
                   
                </div>
                <div className="flex-1 p-4 md:p-8 lg:p-8 lg:w-3/4 w-full text-center lg:text-center">
                    <h2 className="text-3xl font-bold mb-4 text-blue-600">Reset Your Password</h2>
                    <p className="text-xl text-gray-600 mb-4">Enter your phone below to reset your password. We'll send you a otp to create a new one.</p>
                    <form className={`space-y-4 ${showotpForm && "hidden"}`} onSubmit={handleSubmit(OnSubmit)}>
                        <Box sx={{ '& > :not(style)': { m: 1 }, }} noValidate autoComplete="off">
                            <TextField
                                className='w-full'
                                id="phone"
                                label="Enter Your phone no."
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
                                label=" Create password"
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
                            <TextField
                                className='w-full'
                                id="cpassword"
                                label="Confirm password"
                                variant="outlined"
                                type={showCPassword ? 'text' : 'password'}
                                {...register("cpassword", {
                                    required: "Confirm password is required",
                                    validate: value => value === password || "Passwords do not match"
                                })}
                                error={!!errors.cpassword}
                                helperText={errors.cpassword ? errors.cpassword.message : ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            {showCPassword ?
                                                <FiEye className='cursor-pointer' size={25} onClick={() => setShowCPassword(false)} /> :
                                                <FiEyeOff className='cursor-pointer' size={25} onClick={() => setShowCPassword(true)} />
                                            }
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <div className='flex justify-end'>
                            {loading ? (
                                <button disabled className="bg-red-600 text-white py-2 px-10 rounded-full">Please wait...</button>
                            ) : (
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-10 rounded-full">Reset</button>
                            )}
                        </div>
                    </form>

                    {/* OTP Form */}
                    <form className={`space-y-4 ${!showotpForm && "hidden"}`} onSubmit={handleSubmit2(OnSubmitOTP)}>
                        <Box sx={{ '& > :not(style)': { m: 1 }, }} noValidate autoComplete="off">
                            <TextField
                                className='w-full'
                                id="otp"
                                label="Enter OTP"
                                variant="outlined"
                                {...register2("otp", { required: "OTP is required" })}
                                error={!!errors2.otp || !!otpError}
                                helperText={errors2.otp ? errors2.otp.message : otpError}
                            />
                        </Box>
                        <div className='flex flex-col'>
                            {otploading ? (
                                <button disabled className="bg-red-600 text-white py-2 px-10 rounded-full">Please wait...</button>
                            ) : (
                                <button type="submit" className="bg-blue-600 text-white py-2 px-10 rounded-full hover:bg-blue-700">Verify OTP</button>
                            )}
                            {otpSent && <p className="text-gray-500 text-md mt-1">Resend OTP in <span className='text-blue-600'>{timer}</span> seconds</p>}
                            {!otpSent && <button onClick={resendOtp} className="w-full mt-2 py-2 px-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600">Resend OTP</button>}
                        </div>
                    </form>

                </div>
            </div>
        </div>
    )
}

export default ResetPassword
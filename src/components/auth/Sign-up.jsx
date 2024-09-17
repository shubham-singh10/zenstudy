import React, { useState } from 'react';
import { FiEye, FiEyeOff, FiFacebook, FiInstagram, FiTwitter, FiYoutube } from "react-icons/fi";
import { Link, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { Box, TextField, InputAdornment } from '@mui/material';
import { MdPerson, MdPhone } from 'react-icons/md';
import { firebase } from '../../Firebase'; // Adjust the import path as necessary
import { useSpring, animated } from "@react-spring/web";
import { getAuth, signInWithCredential, PhoneAuthProvider } from "firebase/auth";
import Swal from 'sweetalert2';
import { useInView } from 'react-intersection-observer';


const SignUp = () => {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        password: "",
        cpassword: ""
    });
    const [otpSent, setOtpSent] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
    const [showotpForm, setShowOtpForm] = useState(false);
    const [timer, setTimer] = useState(40);
    const [loading, setLoading] = useState(false);
    const [otploading, setotpLoading] = useState(false);
    const [verificationId, setVerificationId] = useState(null);
    const [otpError, setOtpError] = useState("");
    const { register, handleSubmit, formState: { errors }, watch } = useForm();
    const { register: register2, handleSubmit: handleSubmit2, formState: { errors: errors2 } } = useForm();
    const navigate = useNavigate();
    const password = watch("password");


    // Intersection Observers
    const { ref: slideLeftRef, inView: slideLeftInView } = useInView({ triggerOnce: true });
    const { ref: slideUpRef, inView: slideUpInView } = useInView({ triggerOnce: true });
    const { ref: slideRightRef, inView: slideRightInView } = useInView({ triggerOnce: true });


    const SlideUp = useSpring({
        from: { y: 100, opacity: 0 },
        to: { y: slideUpInView ? 0 : 100, opacity: slideUpInView ? 1 : 0 },
        config: { duration: 500 },
    });


    const SlideLeft = useSpring({
        from: { x: -100, opacity: 0 },
        to: { x: slideLeftInView ? 0 : -100, opacity: slideLeftInView ? 1 : 0 },
        config: { duration: 500 },
    });


    const SlideRight = useSpring({
        from: { x: 100, opacity: 0 },
        to: { x: slideRightInView ? 0 : 100, opacity: slideRightInView ? 1 : 0 },
        config: { duration: 500 },
    });


    // Handle OTP Sent to firebase
    const handlePhoneNumberAuth = async (phoneNumber) => {
        try {
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


    // Called Otp Send function and User Verification code
    const OnSubmit = async (data) => {
        setLoading(true);
        setFormData(data);
        try {
            const sendData = {
                phone: data.phone,
            };
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
                throw new Error(errorData.message || "Register failed");
            }
            const resData = await response.json();
            if (resData.message === "Success") {
                Swal.fire({
                    icon: "error",
                    title: "User Already Registered",
                    text: "This phone number is already associated with an account. Please log in to continue.",
                });
            }
        } catch (error) {
            await handlePhoneNumberAuth(`+91${data.phone}`);
        }
    };


    // Resend OTP Timer 40 sec
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


    // OTP Verification and user registration API call
    const OnSubmitOTP = async (data) => {
        try {
            setotpLoading(true);
            const auth = getAuth();
            const credential = PhoneAuthProvider.credential(verificationId, data.otp);
            await signInWithCredential(auth, credential);


            const { phone, name, password } = formData;
            const sendData = { phone, name, password };


            const response = await fetch(
                `${process.env.REACT_APP_API}zenstudy/api/auth/readerSignup`,
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
                throw new Error(errorData.message || "Registration failed");
            }


            const resData = await response.json();
            if (resData.message === "Success") {
                Swal.fire({
                    icon: "success",
                    title: "Registration Successful!",
                    text: `Welcome ${name}! Your account has been created successfully. Please log in to start exploring ZenStudy.`,
                });
                navigate("/sign-In");
            }
        } catch (error) {
            console.error('Error verifying OTP:', error);
            setOtpError("Invalid OTP. Please try again.");
            setotpLoading(false);
            Swal.fire({
                icon: "error",
                title: "Oops...",
                text: `Registration failed: Invalid OTP. Please try again.`,
            });
        }
    };


    // Used to resend OTP
    const resendOtp = async () => {
        await handlePhoneNumberAuth(`+91${formData.phone}`);
    };


    return (
        <div className='p-2 lg:p-12 md:p-10'>
            <div id="recaptcha-container"></div>
            <div className="flex flex-col items-center lg:flex-row p-4 lg:p-12 bg-white gap-10 w-full h-full">
                <animated.div ref={slideLeftRef} style={SlideLeft} className="bg-blue-600 text-center text-white p-4 lg:p-16 rounded-3xl lg:w-1/4 w-full">
                    <h1 className="text-3xl font-bold mb-4">Welcome to ZenStudy</h1>
                    {
                    //     <h3 className="text-xl font-bold mb-4">Connect with us</h3>
                    // <div className="flex space-x-4 justify-center">
                    //     <Link href="#" className="hover:bg-red-500 rounded-full p-2"><FiYoutube size={25} className='hover:text-white' /></Link>
                    //     <Link href="#" className="hover:bg-gradient-to-br from-[#405DE6] via-[#5B51D8] to-[#E1306C] rounded-full p-2"><FiInstagram size={25} className='hover:text-white' /></Link>
                    //     <Link href="#" className="hover:bg-[#4267B2] rounded-full p-2"><FiFacebook size={25} className='hover:text-white' /></Link>
                    //     <Link href="#" className="hover:bg-[#1DA1F2] rounded-full p-2"><FiTwitter size={25} className='hover:text-white' /></Link>
                    // </div>
                }
                </animated.div>
                <div className="flex-1 p-2 lg:p-8 lg:w-3/4 w-full text-center lg:text-center">
                    <animated.h2 ref={slideUpRef} style={SlideUp} className="text-3xl font-bold mb-4 text-blue-600">Join the ZenStudy Community</animated.h2>
                    <animated.p ref={slideUpRef} style={SlideUp} className="text-xl text-gray-600 mb-4">Sign up now to start your learning journey with us.</animated.p>
                    <animated.form ref={slideRightRef} style={SlideRight} className={`space-y-4 ${showotpForm && "hidden"}`} onSubmit={handleSubmit(OnSubmit)}>
                        <Box sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
                            <TextField
                                className='w-full'
                                id="name"
                                label="Enter Full Name"
                                variant="outlined"
                                {...register("name", { required: "Name is required" })}
                                error={!!errors.name}
                                helperText={errors.name ? errors.name.message : ''}
                                InputProps={{
                                    endAdornment: (
                                        <InputAdornment position='end'>
                                            <MdPerson size={25} />
                                        </InputAdornment>
                                    ),
                                }}
                            />
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
                        <div className='flex justify-between'>
                            <p>Already have an account ? <Link to="/sign-In" className='underline text-blue-500 hover:text-blue-700'>Login</Link></p>
                            {loading ? (
                                <button disabled className="bg-red-600 text-white py-2 lg:py-2 lg:px-10 px-4 rounded-full">Please wait...</button>
                            ) : (
                                <button type="submit" className="bg-blue-600 hover:bg-blue-700 text-white py-2 lg:py-2 lg:px-10 px-4 rounded-full">Register</button>
                            )}
                        </div>
                    </animated.form>


                    {/* OTP Form */}
                    <form className={`space-y-4 ${!showotpForm && "hidden"}`} onSubmit={handleSubmit2(OnSubmitOTP)}>
                        <Box sx={{ '& > :not(style)': { m: 1 } }} noValidate autoComplete="off">
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
                                <button type="submit" className="bg-blue-600 text-white py-2 px-10 rounded-full hover:bg-blue-800">Verify OTP</button>
                            )}
                            {otpSent && <p className="text-gray-500 text-md mt-1">Resend OTP in <span className='text-blue-600'>{timer}</span> seconds</p>}
                            {!otpSent && <button onClick={resendOtp} className="w-full mt-2 py-2 px-4 bg-yellow-500 text-white rounded-full hover:bg-yellow-600">Resend OTP</button>}
                        </div>
                    </form>


                </div>
            </div>
        </div>
    );
};


export default SignUp;
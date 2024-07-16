import React, { useState, useEffect } from 'react';
import { getAuth, signInWithCredential, PhoneAuthProvider } from 'firebase/auth';
import { firebase } from '../../Firebase';

const Register = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [otp, setOtp] = useState("");
  const [verificationId, setVerificationId] = useState("");
  const [checkOTP, setCheckOTP] = useState(false);
  const [canResend, setCanResend] = useState(false);
  const [resendTimer, setResendTimer] = useState(20); // Changed to 20 seconds

  useEffect(() => {
    let timer;
    if (canResend && resendTimer > 0) {
      timer = setTimeout(() => {
        setResendTimer(resendTimer - 1);
      }, 1000);
    }
    if (resendTimer === 0) {
      setCanResend(true); // Enable resend button
    }
    return () => clearTimeout(timer);
  }, [canResend, resendTimer]);

  const handlePhoneNumberAuth = async (phoneNumber) => {
    try {
      const recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', {
        size: 'invisible',
        callback: () => {
          console.log('Recaptcha verified');
        },
        defaultCountry: 'IN',
      });

      firebase.auth().signInWithPhoneNumber(phoneNumber, recaptchaVerifier)
        .then((confirmationResult) => {
          setVerificationId(confirmationResult.verificationId);
          alert('OTP Sent');
          setCheckOTP(true);
          setCanResend(false); // Disable resend while waiting for OTP
          setResendTimer(20); // Reset timer to 20 seconds after sending OTP
        })
        .catch((error) => {
          console.error('Error sending OTP:', error);
          setError('Error sending OTP. Please try again.');
          setCanResend(true); // Allow resend on error
        });
    } catch (error) {
      console.error('Error occurred during phone number authentication:', error);
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    const formData = {
      name,
      phone,
      password
    };
    const phoneNumber = `+91${formData.phone}`;
    handlePhoneNumberAuth(phoneNumber);
  };

  const handleVerify = async () => {
    const auth = getAuth();
    const credential = PhoneAuthProvider.credential(verificationId, otp);

    await signInWithCredential(auth, credential);
    alert('OTP Verify confirm');
  };

  const handleResendOTP = () => {
    const phoneNumber = `+91${phone}`;
    handlePhoneNumberAuth(phoneNumber);
    setCanResend(false); // Disable resend button until OTP is sent
  };

  return (
    <div>
      <div id="recaptcha-container"></div>
      <label>Name</label>
      <input className='border-4' value={name} onChange={(e) => setName(e.target.value)} placeholder='Enter your name' />
      <label>Phone No</label>
      <input className='border-4' value={phone} onChange={(e) => setPhone(e.target.value)} placeholder='Enter your phone number' />
      <label>Password</label>
      <input className='border-4' value={password} onChange={(e) => setPassword(e.target.value)} type='password' placeholder='Enter your password' />
      <button className='bg-red-500' onClick={onSubmit}>Send OTP</button>
      {checkOTP && (
        <>
          <input className='border-4' onChange={(e) => setOtp(e.target.value)} />
          <button className='bg-red-500' onClick={handleVerify}>Verify OTP</button>
          {canResend ? (
            <button className='bg-blue-500' onClick={handleResendOTP}>
              Resend OTP
            </button>
          ) : (
            <p>You can resend the OTP in {resendTimer}s</p>
          )}
        </>
      )}
      {error && <p className='text-red-500'>{error}</p>}
    </div>
  );
};

export default Register;

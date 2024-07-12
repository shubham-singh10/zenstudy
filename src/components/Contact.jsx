import React from 'react';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';


const ContactUs = () => {
    return (
        <div>
            <div className="flex flex-col lg:flex-row p-4 lg:p-12 bg-white gap-10">
                <div className="bg-blue-600 text-white p-4 lg:p-16 rounded-3xl flex-1">
                    <h2 className="text-3xl font-bold mb-4">Contact Us</h2>
                    <div className="space-y-4 mb-8">
                        <p><i className="fas fa-envelope"></i> abc@gmail.com</p>
                        <p><i className="fas fa-phone"></i> +91-1111111111</p>
                        <p><i className="fas fa-map-marker-alt"></i> 2, Gulati Chawl, Gulati Chawl, Lbs Marg, Opp. Bhatti Pada Road, Bhandup (west)</p>
                    </div>
                    <h3 className="text-2xl font-bold mb-4">Connect with us</h3>
                    <div className="flex space-x-4">
                        <a href="#"><i className="fab fa-youtube text-2xl"></i></a>
                        <a href="#"><i className="fab fa-instagram text-2xl"></i></a>
                        <a href="#"><i className="fab fa-facebook text-2xl"></i></a>
                        <a href="#"><i className="fab fa-linkedin text-2xl"></i></a>
                    </div>
                </div>
                <div className="flex-1 p-8">
                    <h2 className="text-3xl font-bold mb-8 text-blue-600">Get In Touch</h2>
                    <form className="space-y-4">



                        <Box component="form" sx={{ '& > :not(style)': { m: 1 }, }} noValidate autoComplete="off">


                            <TextField className='w-full' id="outlined-basic" label="Enter Full Name" variant="outlined" />
                            <TextField className='w-full' id="outlined-basic" label="Enter Your Email" variant="outlined" />
                            <TextField className='w-full' id="outlined-basic" label="Enter Your Message" variant="outlined" />

                        </Box>


                        <button type="submit" className="bg-blue-600 text-white py-2 px-4 rounded-md">Submit</button>
                    </form>
                </div>
            </div>

            <div className='p-4 lg:p-16 md:p-8'>
                <h2 className="text-3xl font-bold mb-8  text-blue-600">Find Us On Map</h2>
                <iframe
                    src="https://www.google.com/maps/embed?pb=!1m23!1m12!1m3!1d28013.452410248326!2d77.15255183858231!3d28.63930484227425!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!4m8!3e6!4m0!4m5!1s0x390d03546ed7b9f1%3A0x5067889d8241272f!2szenstudy!3m2!1d28.6467262!2d77.1632791!5e0!3m2!1sen!2sin!4v1720787355305!5m2!1sen!2sin"
                    width="600" height="450" allowfullscreen="" loading="lazy" referrerpolicy="no-referrer-when-downgrade"
                    className='w-full '></iframe>
            </div>



        </div>

    );
};


export default ContactUs;



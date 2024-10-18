import React from 'react'
import { Link } from 'react-router-dom'

function PrivacyPolicy() {
  return (
    <>
     <div className='lg:p-20 md:p-15 p-4 '>
        
        <p className='text-2xl lg:text-3xl md:text-2xl font-bold text-[#054bb4]'>Privacy Policy</p>
       
        <div className='lg:mt-8 mt-2 space-y-5 p-4'>
          
            <p>Any type of personal information that you transmit to Zenstudy Private Limited and its subdomains will be used only for purposes of processing your application and for the assessment and processing of any other administration relevant to Zenstudy Private Limited. This privacy policy applies to the services made available at <span><Link to="https://zenstudy.in" className='text-blue-500'>https://zenstudy.in</Link> </span> and its subdomains alongside the mobile application Zenstudy hosted on Google Play and App Store. Mobile application is hosted by “Zenstudy” and email id of the developer is: grgaurav73@gmail.com</p>
           
            <p>The website and our mobile application will be from now onwards collectively referred to as Platform.</p>
           
            <p>The Statistical information fetched from any personal information transmitted to Zenstudy Private Limited via this website may be shared with third parties but will not include any personally identifiable data. This will be shared just for the statistical purposes.</p>
           
            <p>Zenstudy collects Name, Mobile Number & Profile Photo during Login / Signup feature. The information is used for creation of the user’s account & to send emails regarding services provided by the Zenstudy.</p>
           
            <p>Concerned user can send an email and contact us on contact@zenstudy.in Email ID to get his/her account deleted from our system. But in some cases, we may retain the information for as long as it is required for the purpose of complying with legal obligation or business compliances.</p>
        
        </div>

     </div>
    </>
  )
}

export default PrivacyPolicy
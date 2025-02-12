import React from 'react'
import { Link } from 'react-router-dom'
import { FiShield, FiAlertCircle, FiMail } from "react-icons/fi";
import { PiUserCircle } from "react-icons/pi";

function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
        <div className="overflow-hidden rounded-xl bg-white shadow">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8 sm:px-8">
            <div className="flex items-center gap-3">
              <FiShield className="h-8 w-8 text-white" />
              <h1 className="text-2xl font-bold text-white sm:text-3xl">Privacy Policy</h1>
            </div>
            <p className="mt-2 text-blue-100">Last updated: February 10, 2024</p>
          </div>

          {/* Content */}
          
          <div className="px-6 py-8 sm:px-8">
            <div className="space-y-8">
              {/* Introduction */}
              <section>
                <p className="text-gray-600 leading-relaxed">
                  Any type of personal information that you transmit to Zenstudy Private Limited and its subdomains will
                  be used only for purposes of processing your application and for the assessment and processing of any
                  other administration relevant to Zenstudy Private Limited.
                </p>
              </section>

              {/* Scope */}
              <section>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Scope of Policy</h2>
                <div className="rounded-lg bg-blue-50 p-4">
                  <p className="text-gray-600">This privacy policy applies to the services made available at:</p>
                  <ul className="mt-2 space-y-2 text-gray-600">
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                      https://zenstudy.in and its subdomains
                    </li>
                    <li className="flex items-center gap-2">
                      <span className="h-1.5 w-1.5 rounded-full bg-blue-600"></span>
                      Mobile application Zenstudy (Google Play and App Store)
                    </li>
                  </ul>
                </div>
              </section>

              {/* Information Collection */}
              <section>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Information We Collect</h2>
                <div className="grid gap-6 sm:grid-cols-2">
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <PiUserCircle className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-gray-900">Personal Information</h3>
                    </div>
                    <ul className="space-y-2 text-gray-600">
                      <li>• Name</li>
                      <li>• Mobile Number</li>
                      <li>• Profile Photo</li>
                    </ul>
                  </div>
                  <div className="rounded-lg border border-gray-200 p-4">
                    <div className="mb-3 flex items-center gap-2">
                      <FiAlertCircle className="h-5 w-5 text-blue-600" />
                      <h3 className="font-medium text-gray-900">Statistical Information</h3>
                    </div>
                    <p className="text-gray-600">
                      Statistical information may be shared with third parties for statistical purposes, but will not
                      include personally identifiable data.
                    </p>
                  </div>
                </div>
              </section>

              {/* Data Retention */}
              <section>
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Data Retention & Deletion</h2>
                <p className="text-gray-600 leading-relaxed">
                  Users can request account deletion by contacting us. However, we may retain information as required
                  for legal obligations or business compliances.
                </p>
              </section>

              {/* Contact Information */}
              <section className="rounded-lg bg-gray-50 p-6">
                <h2 className="mb-4 text-xl font-semibold text-gray-900">Contact Us</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="flex items-center gap-3">
                    <FiMail className="h-5 w-5 text-blue-600" />
                    <Link to="mailto:contact@zenstudy.in" className="text-blue-600 hover:underline">
                      contact@zenstudy.in
                    </Link>
                  </div>
                  <div className="flex items-center gap-3">
                    <FiMail className="h-5 w-5 text-blue-600" />
                    <Link to="mailto:grgaurav73@gmail.com" className="text-blue-600 hover:underline">
                      grgaurav73@gmail.com
                    </Link>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default PrivacyPolicy
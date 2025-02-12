import React from 'react'
import { BiBookOpen, BiCreditCard } from 'react-icons/bi';
import { FiAlertCircle, FiExternalLink, FiMail, FiShield } from 'react-icons/fi';
import { LuScrollText } from "react-icons/lu";
import { PiUserCircle } from 'react-icons/pi';
const TermandConditions = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <div className="mx-auto max-w-4xl px-4 py-12 sm:px-6 lg:px-8">
                <div className="overflow-hidden rounded-xl bg-white shadow">
                    {/* Header */}
                    <div className="bg-gradient-to-r from-blue-600 to-blue-700  px-6 py-8 sm:px-8">
                        <div className="flex items-center gap-3">
                            <LuScrollText className="h-8 w-8 text-white" />
                            <h1 className="text-2xl font-bold text-white sm:text-3xl">Terms and Conditions</h1>
                        </div>
                        <p className="mt-2 text-indigo-100">Last updated: March 14, 2024</p>
                    </div>

                    {/* Content */}
                    <div className="px-6 py-8 sm:px-8">
                        <div className="space-y-8">
                            {/* Introduction */}
                            <section className="rounded-lg bg-indigo-50 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FiShield className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">1. Introduction</h2>
                                </div>
                                <p className="text-gray-600 leading-relaxed">
                                    By using Zenstudy Private Limited ("Zenstudy"), including our website (https://zenstudy.in) and mobile app, you agree to these Terms and Conditions.
                                </p>
                            </section>

                            {/* User Eligibility & Registration */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <PiUserCircle className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">2. User Eligibility & Registration</h2>
                                </div>
                                <div className="grid gap-6 sm:grid-cols-2">
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <h3 className="font-medium text-gray-900 mb-2">Requirements</h3>
                                        <ul className="space-y-2 text-gray-600">
                                            <li>• Minimum age: 18 years</li>
                                            <li>• Name</li>
                                            <li>• Mobile Number</li>
                                            <li>• Profile Photo</li>
                                        </ul>
                                    </div>
                                    <div className="rounded-lg border border-gray-200 p-4">
                                        <h3 className="font-medium text-gray-900 mb-2">Account Security</h3>
                                        <p className="text-gray-600">
                                            You are responsible for maintaining the security of your account credentials.
                                        </p>
                                    </div>
                                </div>
                            </section>

                            {/* Services & Content */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <BiBookOpen className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">3. Services & Content</h2>
                                </div>
                                <div className="rounded-lg bg-gray-50 p-6">
                                    <p className="text-gray-600 leading-relaxed">
                                        Zenstudy provides educational content primarily for UPSC aspirants. Content is for learning purposes only and subject to modification.
                                    </p>
                                </div>
                            </section>

                            {/* Payment & Subscription */}
                            <section>
                                <div className="flex items-center gap-3 mb-4">
                                    <BiCreditCard className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">4. Payment & Subscription</h2>
                                </div>
                                <div className="rounded-lg border border-gray-200 p-4">
                                    <ul className="space-y-2 text-gray-600">
                                        <li>• Certain services require payment</li>
                                        <li>• Subscriptions auto-renew unless canceled</li>
                                        <li>• Payments are non-refundable except where required by law</li>
                                    </ul>
                                </div>
                            </section>

                            {/* User Conduct to Contact Info */}
                            {[
                                {
                                    title: "5. User Conduct",
                                    icon: <FiAlertCircle className="h-6 w-6 text-blue-600" />,
                                    content: "Users must not engage in illegal, abusive, or disruptive activities on the Platform."
                                },
                                {
                                    title: "6. Privacy & Data Use",
                                    icon: <FiShield className="h-6 w-6 text-blue-600" />,
                                    content: "Personal information is collected per our Privacy Policy. Users can request account deletion via contact@zenstudy.in, subject to legal retention requirements."
                                },
                                {
                                    title: "7. Intellectual Property",
                                    icon: <BiBookOpen className="h-6 w-6 text-blue-600" />,
                                    content: "All content is owned by Zenstudy or licensors and cannot be copied or modified without permission."
                                },
                                {
                                    title: "8. Third-Party Links",
                                    icon: <FiExternalLink className="h-6 w-6 text-blue-600" />,
                                    content: "Zenstudy is not responsible for external content or services linked on the Platform."
                                },
                                {
                                    title: "9. Limitation of Liability & Termination",
                                    icon: <FiAlertCircle className="h-6 w-6 text-blue-600" />,
                                    content: "Zenstudy is not liable for damages arising from Platform use. Accounts may be suspended for violations."
                                },
                                {
                                    title: "10. Amendments & Governing Law",
                                    icon: <LuScrollText className="h-6 w-6 text-blue-600" />,
                                    content: "Zenstudy may update these Terms. The laws of India govern disputes, with jurisdiction in West Bengal."
                                }
                            ].map((section, index) => (
                                <section key={index} className="rounded-lg bg-gray-50 p-6">
                                    <div className="flex items-center gap-3 mb-4">
                                        {section.icon}
                                        <h2 className="text-xl font-semibold text-gray-900">{section.title}</h2>
                                    </div>
                                    <p className="text-gray-600 leading-relaxed">{section.content}</p>
                                </section>
                            ))}

                            {/* Contact Information */}
                            <section className="rounded-lg bg-indigo-50 p-6">
                                <div className="flex items-center gap-3 mb-4">
                                    <FiMail className="h-6 w-6 text-blue-600" />
                                    <h2 className="text-xl font-semibold text-gray-900">11. Contact Information</h2>
                                </div>
                                <div className="flex items-center gap-3">
                                    <a href="mailto:contact@zenstudy.in" className="text-blue-600 hover:underline">
                                        contact@zenstudy.in
                                    </a>
                                </div>
                            </section>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default TermandConditions
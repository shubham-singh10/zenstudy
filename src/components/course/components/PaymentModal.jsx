import React, { useState } from 'react';
import { BiCalendar, BiCheck, BiCreditCard } from 'react-icons/bi';
import { FiX } from "react-icons/fi"

export const PaymentModal = ({ 
  isOpen, 
  onClose, 
  paymentOptions, 
  onPayment 
}) => {
  const [selectedOption, setSelectedOption] = useState(paymentOptions[1]);
  const [userDetails, setUserDetails] = useState({
    name: '',
    email: '',
    phone: ''
  });
  const [showUserForm, setShowUserForm] = useState(false);

  if (!isOpen) return null;

  const handleProceed = () => {
    if (!showUserForm) {
      setShowUserForm(true);
    } else {
      onPayment(selectedOption, userDetails);
    }
  };

  const isFormValid = userDetails.name && userDetails.email && userDetails.phone;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold text-gray-800">Choose Your Plan</h2>
            <button 
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <FiX className="w-6 h-6" />
            </button>
          </div>

          {!showUserForm ? (
            <>
              <div className="space-y-4 mb-6">
                {paymentOptions.map((option) => (
                  <div
                    key={option.type}
                    className={`relative border-2 rounded-xl p-4 cursor-pointer transition-all duration-200 ${
                      selectedOption.type === option.type
                        ? 'border-purple-500 bg-purple-50'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    onClick={() => setSelectedOption(option)}
                  >
                    {option.popular && (
                      <div className="absolute -top-2 left-4 bg-gradient-to-r from-purple-600 to-purple-700 text-white px-3 py-1 text-xs font-semibold rounded-full">
                        Most Popular
                      </div>
                    )}
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-3">
                        <div className="flex items-center justify-center w-6 h-6 mt-1">
                          {option.type === 'onetime' ? <BiCreditCard className="w-5 h-5" /> : <BiCalendar className="w-5 h-5" />}
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-800">{option.title}</h3>
                          <p className="text-sm text-gray-600 mt-1">{option.description}</p>
                          <div className="mt-2">
                            <span className="text-2xl font-bold text-purple-600">₹{option.price}</span>
                            {option.type === 'monthly' && (
                              <span className="text-gray-500 text-sm">/month</span>
                            )}
                          </div>
                        </div>
                      </div>
                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center ${
                        selectedOption.type === option.type 
                          ? 'border-purple-500 bg-purple-500' 
                          : 'border-gray-300'
                      }`}>
                        {selectedOption.type === option.type && (
                          <BiCheck className="w-3 h-3 text-white" />
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <h4 className="font-semibold text-gray-800 mb-2">What's Included:</h4>
                <ul className="space-y-1 text-sm text-gray-600">
                  <li>• Live Interactive Classes</li>
                  <li>• Recorded Lectures Access</li>
                  <li>• Comprehensive Study Materials</li>
                  <li>• Personal Mentorship</li>
                  <li>• Mock Tests & Analysis</li>
                  <li>• 24/7 Doubt Resolution</li>
                </ul>
              </div>
            </>
          ) : (
            <div className="space-y-4 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">Enter Your Details</h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your full name"
                  value={userDetails.name}
                  onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your email"
                  value={userDetails.email}
                  onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                <input
                  type="tel"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Enter your phone number"
                  value={userDetails.phone}
                  onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                />
              </div>

              <div className="bg-blue-50 rounded-lg p-4 mt-4">
                <h4 className="font-semibold text-blue-800">Selected Plan:</h4>
                <p className="text-blue-700">{selectedOption.title} - ₹{selectedOption.price}{selectedOption.type === 'monthly' ? '/month' : ''}</p>
              </div>
            </div>
          )}

          <button
            onClick={handleProceed}
            disabled={showUserForm && !isFormValid}
            className={`w-full py-3 px-4 rounded-lg font-semibold transition-all duration-200 ${
              showUserForm && !isFormValid
                ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                : 'bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white shadow-lg hover:shadow-xl'
            }`}
          >
            {showUserForm ? 'Proceed to Payment' : 'Continue'}
          </button>

          {showUserForm && (
            <button
              onClick={() => setShowUserForm(false)}
              className="w-full mt-2 py-2 px-4 text-gray-600 hover:text-gray-800 transition-colors"
            >
              Back to Plan Selection
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
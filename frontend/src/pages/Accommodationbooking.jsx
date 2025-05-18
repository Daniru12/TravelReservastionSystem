import React, { useState, useEffect } from "react";
import axios from "axios";

const initialFormState = {
  accommodation: "",
  name: "",
  idNumber: "",
  emailAddress: "",
  contactNo: "",
  packageType: "normal",
  numberOfTravellers: 1,
  specialNeeds: "",
};

// Price mapping for different package types
const packagePrices = {
  normal: 100,
  premium: 250,
  vip: 500,
};

export default function BookingForm() {
  const [formData, setFormData] = useState(initialFormState);
  const [message, setMessage] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);
  const [totalPrice, setTotalPrice] = useState(packagePrices.normal);
  const [validationErrors, setValidationErrors] = useState({});

  // Calculate price whenever package type or number of travelers changes
  useEffect(() => {
    const basePrice = packagePrices[formData.packageType] || packagePrices.normal;
    setTotalPrice(basePrice * formData.numberOfTravellers);
  }, [formData.packageType, formData.numberOfTravellers]);

  // Handle input change for all inputs
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfTravellers" ? Math.max(1, Number(value)) : value,
    }));

    // Clear validation error for this field when user starts typing
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({
        ...prev,
        [name]: null,
      }));
    }
  };

  // Validate the current step
  const validateStep = (step) => {
    const errors = {};

    if (step === 1) {
      if (!formData.accommodation.trim()) errors.accommodation = "Accommodation ID is required";
      if (!formData.name.trim()) errors.name = "Name is required";
      if (!formData.idNumber.trim()) errors.idNumber = "ID Number is required";
    } else if (step === 2) {
      if (!formData.emailAddress.trim()) errors.emailAddress = "Email is required";
      else if (!/^\S+@\S+\.\S+$/.test(formData.emailAddress)) errors.emailAddress = "Invalid email format";

      if (!formData.contactNo.trim()) errors.contactNo = "Contact number is required";
    }

    setValidationErrors(errors);
    return Object.keys(errors).length === 0;
  };

  // Handle next step
  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  // Handle prev step
  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  // Submit handler with axios
  const handleSubmit = async () => {
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/api/booking", formData);
      setMessage("Booking successful! Booking ID: " + response.data._id);
      setFormData(initialFormState);
      setCurrentStep(1);
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Failed to submit booking";
      setMessage("Error: " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Render form fields based on current step
  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Accommodation ID*
                  </label>
                  <input
                    type="text"
                    name="accommodation"
                    value={formData.accommodation}
                    onChange={handleChange}
                    placeholder="Accommodation ObjectId"
                    className={`w-full px-3 py-2 border ${
                      validationErrors.accommodation ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                  {validationErrors.accommodation && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.accommodation}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Full Name*
                  </label>
                  <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Enter your full name"
                    className={`w-full px-3 py-2 border ${
                      validationErrors.name ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                  {validationErrors.name && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    ID Number*
                  </label>
                  <input
                    type="text"
                    name="idNumber"
                    value={formData.idNumber}
                    onChange={handleChange}
                    placeholder="National ID or passport number"
                    className={`w-full px-3 py-2 border ${
                      validationErrors.idNumber ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                  {validationErrors.idNumber && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.idNumber}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      case 2:
        return (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Details</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email Address*
                  </label>
                  <input
                    type="email"
                    name="emailAddress"
                    value={formData.emailAddress}
                    onChange={handleChange}
                    placeholder="your.email@example.com"
                    className={`w-full px-3 py-2 border ${
                      validationErrors.emailAddress ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                  {validationErrors.emailAddress && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.emailAddress}</p>
                  )}
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Contact Number*
                  </label>
                  <input
                    type="tel"
                    name="contactNo"
                    value={formData.contactNo}
                    onChange={handleChange}
                    placeholder="+1 (555) 123-4567"
                    className={`w-full px-3 py-2 border ${
                      validationErrors.contactNo ? "border-red-500" : "border-gray-300"
                    } rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200`}
                  />
                  {validationErrors.contactNo && (
                    <p className="text-red-500 text-xs mt-1">{validationErrors.contactNo}</p>
                  )}
                </div>
              </div>
            </div>
          </>
        );
      case 3:
        return (
          <>
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-700 mb-4">Package Selection</h3>
              <div className="space-y-4">
                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Package Type*
                  </label>
                  <div className="grid grid-cols-3 gap-3">
                    <div
                      className={`border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                        formData.packageType === "normal"
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                      onClick={() =>
                        handleChange({ target: { name: "packageType", value: "normal" } })
                      }
                    >
                      <div className="text-center">
                        <div className="font-medium">Normal</div>
                        <div className="text-sm text-gray-500">${packagePrices.normal}/person</div>
                      </div>
                    </div>
                    <div
                      className={`border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                        formData.packageType === "premium"
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                      onClick={() =>
                        handleChange({ target: { name: "packageType", value: "premium" } })
                      }
                    >
                      <div className="text-center">
                        <div className="font-medium">Premium</div>
                        <div className="text-sm text-gray-500">${packagePrices.premium}/person</div>
                      </div>
                    </div>
                    <div
                      className={`border rounded-md p-3 cursor-pointer transition-all duration-200 ${
                        formData.packageType === "vip"
                          ? "border-blue-500 bg-blue-50 shadow-sm"
                          : "border-gray-300 hover:border-blue-300"
                      }`}
                      onClick={() =>
                        handleChange({ target: { name: "packageType", value: "vip" } })
                      }
                    >
                      <div className="text-center">
                        <div className="font-medium">VIP</div>
                        <div className="text-sm text-gray-500">${packagePrices.vip}/person</div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Number of Travellers*
                  </label>
                  <div className="flex items-center">
                    <button
                      type="button"
                      onClick={() =>
                        handleChange({
                          target: { name: "numberOfTravellers", value: Math.max(1, formData.numberOfTravellers - 1) },
                        })
                      }
                      className="px-3 py-1 bg-gray-200 rounded-l-md hover:bg-gray-300 focus:outline-none"
                    >
                      -
                    </button>
                    <input
                      type="number"
                      name="numberOfTravellers"
                      value={formData.numberOfTravellers}
                      onChange={handleChange}
                      min={1}
                      className="w-16 text-center py-1 border-t border-b border-gray-300 focus:outline-none"
                    />
                    <button
                      type="button"
                      onClick={() =>
                        handleChange({
                          target: { name: "numberOfTravellers", value: formData.numberOfTravellers + 1 },
                        })
                      }
                      className="px-3 py-1 bg-gray-200 rounded-r-md hover:bg-gray-300 focus:outline-none"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="form-group">
                  <label className="block text-sm font-medium text-gray-700 mb-1">Special Needs</label>
                  <textarea
                    name="specialNeeds"
                    value={formData.specialNeeds}
                    onChange={handleChange}
                    placeholder="Any special requirements or requests"
                    rows={3}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-200"
                  />
                </div>

                <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-100">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">Total Price:</span>
                    <span className="text-lg font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {formData.packageType.charAt(0).toUpperCase() + formData.packageType.slice(1)} package ×{" "}
                    {formData.numberOfTravellers} {formData.numberOfTravellers > 1 ? "travellers" : "traveller"}
                  </div>
                </div>
              </div>
            </div>
          </>
        );
      default:
        return null;
    }
  };

  // Progress indicator component
  const ProgressIndicator = () => {
    return (
      <div className="flex items-center justify-center mb-8">
        {[1, 2, 3].map((step) => (
          <React.Fragment key={step}>
            <div
              className={`w-8 h-8 flex items-center justify-center rounded-full transition-all duration-300 ${
                currentStep === step
                  ? "bg-blue-600 text-white"
                  : currentStep > step
                  ? "bg-green-500 text-white"
                  : "bg-gray-200 text-gray-600"
              }`}
            >
              {currentStep > step ? "✓" : step}
            </div>
            {step < 3 && (
              <div
                className={`h-1 w-16 transition-all duration-300 ${
                  currentStep > step ? "bg-green-500" : "bg-gray-200"
                }`}
              ></div>
            )}
          </React.Fragment>
        ))}
      </div>
    );
  };

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg max-w-md mx-auto border border-gray-200">
      <h2 className="text-2xl font-bold text-center text-blue-600 mb-2">Accommodation Booking</h2>
      <p className="text-center text-gray-500 mb-6">Complete the form to secure your reservation</p>

      {message && (
        <div
          className={`p-4 mb-6 rounded-md ${
            message.includes("Error")
              ? "bg-red-100 text-red-700 border border-red-200"
              : "bg-green-100 text-green-700 border border-green-200"
          }`}
        >
          {message}
        </div>
      )}

      <ProgressIndicator />

      <div className="transition-all duration-300">
        {renderFormStep()}

        <div className="flex justify-between mt-8">
          {currentStep > 1 && (
            <button
              onClick={handlePrevStep}
              className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Back
            </button>
          )}

          {currentStep < 3 ? (
            <button
              onClick={handleNextStep}
              className="ml-auto px-4 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            >
              Next
            </button>
          ) : (
            <button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className={`ml-auto px-4 py-2 rounded-md text-white font-medium ${
                isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
              } transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2`}
            >
              {isSubmitting ? "Processing..." : "Complete Booking"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

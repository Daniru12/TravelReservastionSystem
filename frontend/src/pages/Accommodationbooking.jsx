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

  useEffect(() => {
    const basePrice = packagePrices[formData.packageType] || packagePrices.normal;
    setTotalPrice(basePrice * formData.numberOfTravellers);
  }, [formData.packageType, formData.numberOfTravellers]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === "numberOfTravellers" ? Math.max(1, Number(value)) : value,
    }));
    if (validationErrors[name]) {
      setValidationErrors((prev) => ({ ...prev, [name]: null }));
    }
  };

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

  const handleNextStep = () => {
    if (validateStep(currentStep)) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const handlePrevStep = () => {
    setCurrentStep((prev) => prev - 1);
  };

  const handleSubmit = async () => {
    if (!validateStep(currentStep)) return;

    setIsSubmitting(true);
    setMessage(null);

    try {
      const backendUrl = import.meta.env.VITE_BACKEND_URL || ""; // Adjust your backend URL here

      const response = await axios.post(`${backendUrl}/api/booking/create`, formData);

      setMessage(`Booking successful! Booking ID: ${response.data._id}`);
      setFormData(initialFormState);
      setCurrentStep(1);
      setValidationErrors({});
    } catch (error) {
      const errorMsg =
        error.response?.data?.message || error.message || "Failed to submit booking";
      setMessage("Error: " + errorMsg);
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderFormStep = () => {
    switch (currentStep) {
      case 1:
        return (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Personal Information</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="accommodation" className="block text-sm font-medium text-gray-700">
                  Accommodation ID*
                </label>
                <input
                  id="accommodation"
                  name="accommodation"
                  type="text"
                  value={formData.accommodation}
                  onChange={handleChange}
                  placeholder="Accommodation ObjectId"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.accommodation ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {validationErrors.accommodation && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.accommodation}</p>
                )}
              </div>
              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                  Full Name*
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.name ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {validationErrors.name && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.name}</p>
                )}
              </div>
              <div>
                <label htmlFor="idNumber" className="block text-sm font-medium text-gray-700">
                  ID Number*
                </label>
                <input
                  id="idNumber"
                  name="idNumber"
                  type="text"
                  value={formData.idNumber}
                  onChange={handleChange}
                  placeholder="National ID or passport number"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.idNumber ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {validationErrors.idNumber && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.idNumber}</p>
                )}
              </div>
            </div>
          </>
        );

      case 2:
        return (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Contact Details</h3>
            <div className="space-y-4">
              <div>
                <label htmlFor="emailAddress" className="block text-sm font-medium text-gray-700">
                  Email Address*
                </label>
                <input
                  id="emailAddress"
                  name="emailAddress"
                  type="email"
                  value={formData.emailAddress}
                  onChange={handleChange}
                  placeholder="your.email@example.com"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.emailAddress ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {validationErrors.emailAddress && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.emailAddress}</p>
                )}
              </div>
              <div>
                <label htmlFor="contactNo" className="block text-sm font-medium text-gray-700">
                  Contact Number*
                </label>
                <input
                  id="contactNo"
                  name="contactNo"
                  type="tel"
                  value={formData.contactNo}
                  onChange={handleChange}
                  placeholder="+1 (555) 123-4567"
                  className={`mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    validationErrors.contactNo ? "border-red-500" : "border-gray-300"
                  }`}
                />
                {validationErrors.contactNo && (
                  <p className="text-red-500 text-xs mt-1">{validationErrors.contactNo}</p>
                )}
              </div>
            </div>
          </>
        );

      case 3:
        return (
          <>
            <h3 className="text-lg font-semibold text-gray-700 mb-4">Package Selection</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Package Type*</label>
                <div className="grid grid-cols-3 gap-3">
                  {["normal", "premium", "vip"].map((pkg) => (
                    <div
                      key={pkg}
                      className={`cursor-pointer rounded-md border p-3 text-center transition-all duration-200 ${
                        formData.packageType === pkg
                          ? "border-blue-600 bg-blue-50 shadow"
                          : "border-gray-300 hover:border-blue-400"
                      }`}
                      onClick={() => handleChange({ target: { name: "packageType", value: pkg } })}
                    >
                      <div className="font-medium capitalize">{pkg}</div>
                      <div className="text-sm text-gray-500">${packagePrices[pkg]}/person</div>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label htmlFor="numberOfTravellers" className="block text-sm font-medium text-gray-700 mb-1">
                  Number of Travellers*
                </label>
                <div className="flex items-center max-w-xs">
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: { name: "numberOfTravellers", value: Math.max(1, formData.numberOfTravellers - 1) },
                      })
                    }
                    className="rounded-l-md border border-gray-300 bg-gray-200 px-3 py-1 hover:bg-gray-300 focus:outline-none"
                  >
                    -
                  </button>
                  <input
                    id="numberOfTravellers"
                    name="numberOfTravellers"
                    type="number"
                    min={1}
                    value={formData.numberOfTravellers}
                    onChange={handleChange}
                    className="w-16 border-t border-b border-gray-300 py-1 text-center focus:outline-none"
                  />
                  <button
                    type="button"
                    onClick={() =>
                      handleChange({
                        target: { name: "numberOfTravellers", value: formData.numberOfTravellers + 1 },
                      })
                    }
                    className="rounded-r-md border border-gray-300 bg-gray-200 px-3 py-1 hover:bg-gray-300 focus:outline-none"
                  >
                    +
                  </button>
                </div>
              </div>

              <div>
                <label htmlFor="specialNeeds" className="block text-sm font-medium text-gray-700 mb-1">
                  Special Needs
                </label>
                <textarea
                  id="specialNeeds"
                  name="specialNeeds"
                  value={formData.specialNeeds}
                  onChange={handleChange}
                  rows={3}
                  placeholder="Any special requirements or requests"
                  className="mt-1 block w-full rounded-md border px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="mt-6 rounded-lg border border-blue-200 bg-blue-50 p-4">
                <div className="flex justify-between">
                  <span className="font-medium">Total Price:</span>
                  <span className="text-lg font-bold text-blue-600">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="text-xs text-gray-600">
                  {formData.packageType.charAt(0).toUpperCase() + formData.packageType.slice(1)} package × {formData.numberOfTravellers}{" "}
                  {formData.numberOfTravellers > 1 ? "travellers" : "traveller"}
                </div>
              </div>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  const ProgressIndicator = () => (
    <div className="flex items-center justify-center mb-6">
      {[1, 2, 3].map((step) => (
        <React.Fragment key={step}>
          <div
            className={`flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold transition-colors duration-300 ${
              currentStep === step
                ? "bg-blue-600 text-white"
                : currentStep > step
                ? "bg-green-500 text-white"
                : "bg-gray-300 text-gray-600"
            }`}
          >
            {currentStep > step ? "✓" : step}
          </div>
          {step < 3 && (
            <div
              className={`mx-2 h-1 w-10 rounded transition-colors duration-300 ${
                currentStep > step ? "bg-green-500" : "bg-gray-300"
              }`}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  );

  return (
    <div className="mx-auto max-w-md rounded-lg border border-gray-200 bg-white p-8 shadow-lg">
      <h2 className="mb-2 text-center text-2xl font-bold text-blue-600">Accommodation Booking</h2>
      <p className="mb-6 text-center text-gray-600">Complete the form to secure your reservation</p>

      {message && (
        <div
          className={`mb-6 rounded-md p-4 text-center ${
            message.startsWith("Error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </div>
      )}

      <ProgressIndicator />

      <form
        onSubmit={(e) => {
          e.preventDefault();
          if (currentStep < 3) {
            handleNextStep();
          } else {
            handleSubmit();
          }
        }}
      >
        {renderFormStep()}

        <div className="mt-6 flex justify-between">
          {currentStep > 1 && (
            <button
              type="button"
              onClick={handlePrevStep}
              className="rounded border border-gray-300 px-4 py-2 text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Back
            </button>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className={`ml-auto rounded px-4 py-2 font-medium text-white focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              isSubmitting ? "bg-blue-400" : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isSubmitting
              ? "Processing..."
              : currentStep < 3
              ? "Next"
              : "Complete Booking"}
          </button>
        </div>
      </form>
    </div>
  );
}

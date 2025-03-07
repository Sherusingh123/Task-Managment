import React, { useState } from "react";
import emailjs from "emailjs-com";

const Contact = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    message: "",
  });
  const [statusMessage, setStatusMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPopup, setShowPopup] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    emailjs
      .send(
        "service_v9z4g3p", // Service ID
        "template_26obgn1", // Template ID
        {
          to_name: "Admin", // Replace with your desired recipient name
          from_name: formData.name,
          from_email: formData.email,
          address: formData.address,
          message: formData.message,
        },
        "YdKII9MDklndR6Inz" // User ID
      )
      .then(
        () => {
          setStatusMessage("Message sent successfully!");
          setShowPopup(true);
          setIsSubmitting(false);
          setFormData({ name: "", email: "", address: "", message: "" });
          setTimeout(() => setShowPopup(false), 3000);
        },
        () => {
          setStatusMessage("Failed to send the message. Please try again.");
          setShowPopup(true);
          setIsSubmitting(false);
          setTimeout(() => setShowPopup(false), 3000);
        }
      );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-200 to-blue-100 flex flex-col items-center justify-center px-6 py-10">
      <div className="text-center max-w-3xl">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-6">
          Contact Us
        </h1>
        <p className="text-lg text-gray-800 leading-relaxed mb-8">
          We value your feedback. Please fill out the form below, and we will
          get back to you as soon as possible.
        </p>
      </div>

      <div className="w-full max-w-2xl bg-white p-10 rounded-lg shadow-xl transition-transform transform hover:scale-105">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Name
            </label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Your Name"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Email
            </label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Your Email"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Address
            </label>
            <input
              type="text"
              name="address"
              value={formData.address}
              onChange={handleChange}
              placeholder="Your Address"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleChange}
              placeholder="Your Message"
              rows="5"
              className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500 transition-all duration-300"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            className={`w-full py-3 text-white font-medium rounded-md transition-all duration-300 ${
              isSubmitting ? "bg-gray-400" : "bg-yellow-600 hover:bg-yellow-700"
            }`}
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>

        {showPopup && (
          <div className="mt-4 p-4 text-center bg-yellow-100 border border-yellow-500 text-yellow-700 rounded-md">
            {statusMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default Contact;

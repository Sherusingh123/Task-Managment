import React from "react";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-100 flex flex-col items-center justify-center px-6 py-10">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl font-extrabold text-blue-700 mb-6">
          Privacy Policy
        </h1>
        <p className="text-lg text-gray-800 leading-relaxed mb-8">
          Your privacy is of utmost importance to us. This page outlines how we
          collect, use, and safeguard your information when you interact with
          our services.
        </p>
      </div>

      <div className="w-full max-w-3xl bg-white p-8 rounded-lg shadow-lg space-y-6">
        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Information We Collect
          </h2>
          <p className="text-gray-700">
            We collect personal information that you provide to us, such as your
            name, email address, and any details you submit through our contact
            forms. This data helps us to deliver better services and respond to
            your queries effectively.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            How We Use Your Information
          </h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>To improve and personalize your experience on our platform.</li>
            <li>
              To communicate with you regarding updates, offers, and support.
            </li>
            <li>To ensure the security and reliability of our services.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Your Rights
          </h2>
          <p className="text-gray-700">
            You have the right to access, update, or delete the information we
            have collected about you. If you wish to exercise these rights,
            please contact us.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Data Security
          </h2>
          <p className="text-gray-700">
            We implement advanced security measures to ensure that your data is
            protected from unauthorized access or disclosure. However, no system
            is entirely foolproof, so we encourage you to take personal
            precautions as well.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-semibold text-blue-700 mb-4">
            Updates to This Policy
          </h2>
          <p className="text-gray-700">
            We may update this privacy policy from time to time. Any changes
            will be communicated through our website. We encourage you to review
            this page regularly to stay informed.
          </p>
        </section>
      </div>
    </div>
  );
};

export default Privacy;

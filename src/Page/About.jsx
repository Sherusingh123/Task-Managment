import React from "react";

const About = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 to-blue-100 flex flex-col items-center justify-center px-6 py-10">
      <div className="text-center max-w-4xl">
        <h1 className="text-5xl font-extrabold text-blue-600 mb-6">About Us</h1>
        <p className="text-lg text-blue-700 leading-relaxed mb-8">
          Welcome to{" "}
          <span className="font-semibold text-blue-600">Our Platform</span>,
          where efficiency meets productivity! Our mission is to empower teams
          with tools that streamline task management, foster collaboration, and
          bring clarity to daily operations. Whether you're an administrator or
          an employee, we aim to make task tracking and completion simpler,
          faster, and more rewarding.
        </p>
        <p className="text-lg text-blue-700 leading-relaxed mb-8">
          We believe in creating a workplace where tasks are not just completed
          but celebrated. By combining cutting-edge technology with a
          user-friendly interface, we ensure that every user experiences ease
          and efficiency while managing their workflow.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition transform hover:scale-105 border border-blue-300">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              Our Vision
            </h3>
            <p className="text-blue-700">
              To revolutionize task management by providing intuitive tools that
              adapt to the dynamic needs of modern teams.
            </p>
          </div>
          <div className="p-6 bg-white rounded-lg shadow-lg hover:shadow-2xl transition transform hover:scale-105 border border-blue-300">
            <h3 className="text-2xl font-semibold text-blue-600 mb-4">
              Our Mission
            </h3>
            <p className="text-blue-700">
              To create a seamless task management experience that boosts
              productivity and enhances collaboration across teams.
            </p>
          </div>
        </div>
      </div>

      <div className="mt-10 text-center">
        <h2 className="text-3xl font-extrabold text-blue-600 mb-4">
          Why Choose Us?
        </h2>
        <p className="text-lg text-blue-700 max-w-2xl mx-auto mb-6">
          With a focus on simplicity and efficiency, we provide tailored
          solutions for task management that save time and effort. Experience
          the power of smart collaboration today!
        </p>
      </div>
    </div>
  );
};

export default About;

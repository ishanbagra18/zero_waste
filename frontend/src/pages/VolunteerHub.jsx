import React from 'react';

const VolunteerHub = () => {
  return (
<div className="w-full bg-gray-900 text-gray-200 px-6 py-12 mx-auto">
      <header className="mb-12 text-center">
        <h1 className="text-4xl font-extrabold mb-2">🌍 Volunteer Hub</h1>
        <p className="text-lg text-gray-400 max-w-3xl mx-auto">
          A Bridge Between NGOs and Volunteers for Impactful Mobility
        </p>
      </header>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-4 text-teal-400">About Volunteer Hub</h2>
        <p className="text-gray-300 leading-relaxed">
          In a world where collaboration, compassion, and mobility are vital to making a difference, the Volunteer Hub emerges as a groundbreaking digital platform. Designed to connect Non-Governmental Organizations (NGOs) with dedicated volunteers, this platform facilitates efficient and purposeful travel-based volunteering services.
          Whether it's transporting essential goods, accompanying individuals, or reaching underserved areas, Volunteer Hub ensures that help is never far away.
        </p>
        <p className="mt-4 text-gray-300 leading-relaxed">
          At its core, Volunteer Hub is more than just a portal—it's an ecosystem that amplifies social impact through structured volunteer mobility.
        </p>
      </section>

      <section className="mb-16">
        <h2 className="text-3xl font-semibold mb-4 text-teal-400">🎯 The Core Purpose of Volunteer Hub</h2>
        <p className="text-gray-300 leading-relaxed max-w-4xl">
          Many NGOs struggle with logistical challenges. They operate in diverse environments, often lacking the infrastructure or manpower to move resources from one place to another. Whether it's delivering aid to disaster zones, transporting donated items to remote villages, or arranging medical visits in rural areas, mobility remains a critical concern.
        </p>
        <p className="mt-4 text-gray-300 leading-relaxed max-w-4xl">
          Meanwhile, many individuals are eager to contribute their time and energy to meaningful causes. However, they often lack a centralized, transparent system to discover such opportunities.
        </p>
        <p className="mt-4 text-gray-300 leading-relaxed max-w-4xl">
          Volunteer Hub solves this exact problem—by acting as a central booking and coordination platform where:
        </p>

        <ul className="list-disc list-inside mt-4 text-gray-300 space-y-2 max-w-3xl">
          <li>NGOs can post travel-based volunteer needs (e.g., “Help transport supplies from Jaipur to Ajmer”).</li>
          <li>Volunteers can view, accept, and manage bookings based on their location, schedule, and interest.</li>
          <li>Both parties can track status, communicate, and receive real-time updates about the tasks.</li>
        </ul>

        <p className="mt-6 text-teal-300 font-semibold max-w-3xl">
          This results in a win-win situation: NGOs receive reliable help, and volunteers get a structured, rewarding way to contribute.
        </p>
      </section>

      <section>
        <h2 className="text-3xl font-semibold mb-6 text-teal-400">🔄 How It Works</h2>

        <article className="mb-8">
          <h3 className="text-xl font-semibold mb-2">NGO Registration & Posting</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1 max-w-3xl">
            <li>NGOs register on the platform by creating a verified profile.</li>
            <li>They post a “Booking” that includes:
              <ul className="list-disc list-inside ml-6 space-y-1 mt-1">
                <li>Pickup location</li>
                <li>Drop location</li>
                <li>Date & time</li>
                <li>Description (what’s being transported or the goal of the trip)</li>
                <li>Notes on required experience (if any)</li>
              </ul>
            </li>
          </ul>
        </article>

        <article className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Volunteer Discovery & Acceptance</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1 max-w-3xl">
            <li>Volunteers sign up, browse open bookings, and filter based on distance or availability.</li>
            <li>Upon accepting a booking, the system locks it and notifies the NGO.</li>
          </ul>
        </article>

        <article className="mb-8">
          <h3 className="text-xl font-semibold mb-2">Status Tracking & Notifications</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1 max-w-3xl">
            <li>Booking statuses flow through stages: pending, accepted, rejected, cancelled, completed.</li>
            <li>Both parties receive notifications whenever a status changes (e.g., a volunteer accepts or cancels).</li>
            <li>Real-time updates keep everyone informed.</li>
          </ul>
        </article>

        <article>
          <h3 className="text-xl font-semibold mb-2">Completion & Feedback</h3>
          <ul className="list-disc list-inside text-gray-300 space-y-1 max-w-3xl">
            <li>Once the task is done, both parties can mark it completed and leave feedback, helping build trust and credibility on the platform.</li>
          </ul>
        </article>
      </section>
    </div>
  );
};

export default VolunteerHub;

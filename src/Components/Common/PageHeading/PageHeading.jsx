import React from 'react';

// Shared user-facing page heading: bold title + optional muted subtitle.
// Used across the booking flow (Venues, Venue Services, Checkout, ...).
const PageHeading = ({ title, subtitle, className = 'mb-4' }) => (
  <div className={className}>
    <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
    {subtitle && <p className="text-sm text-gray-500 mt-1">{subtitle}</p>}
  </div>
);

export default PageHeading;

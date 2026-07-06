import React from 'react';

// Sticky summary sidebar shared across the booking flow — the Venue Services
// "Selected Services" panel and the Checkout "Price Summary" panel.
//
// On large screens it pins beside the scrolling content (`sticky top-4`) and,
// crucially, caps its own height at the viewport and scrolls internally, so the
// action button at the bottom stays reachable no matter how long the list gets.
const SummaryPanel = ({ children, className = '' }) => (
  <aside className="lg:sticky lg:top-4 lg:max-h-[calc(100vh-2rem)] lg:overflow-y-auto">
    <div className={`bg-white rounded-lg border border-gray-200 shadow-sm p-4 ${className}`}>
      {children}
    </div>
  </aside>
);

export default SummaryPanel;

import React from 'react';
import { Loader2 } from 'lucide-react';

/**
 * Reusable animated loader.
 *
 * @param {string}  label       Text shown under the spinner (pass "" to hide).
 * @param {boolean} fullScreen  Center in the viewport (route/page guards). When
 *                              false, it sits inline within a section instead.
 * @param {string}  className   Extra classes for the wrapper.
 */
const Loader = ({ label = 'Loading', fullScreen = true, className = '' }) => {
  return (
    <div
      className={`flex w-full flex-col items-center justify-center gap-4 ${
        fullScreen ? 'min-h-screen' : 'py-20'
      } ${className}`}
    >
      <span className="relative flex h-16 w-16 items-center justify-center">
        {/* soft pulsing halo behind the icon */}
        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-teal-400/30" />
        {/* spinning icon */}
        <Loader2 className="relative h-12 w-12 animate-spin text-teal-600" strokeWidth={2.5} />
      </span>

      {label && (
        <p className="flex items-center text-sm font-medium tracking-wide text-gray-500">
          {label}
          <span className="ml-0.5 inline-flex">
            <span className="animate-bounce [animation-delay:-0.3s]">.</span>
            <span className="animate-bounce [animation-delay:-0.15s]">.</span>
            <span className="animate-bounce">.</span>
          </span>
        </p>
      )}
    </div>
  );
};

export default Loader;

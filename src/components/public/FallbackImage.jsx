import React, { useState } from "react";
import { Dumbbell } from "lucide-react";

// Wraps <img> with a graceful dark fallback (instead of a broken-image icon)
// if the external source fails to load — used throughout the public site
// since hero/section imagery comes from external URLs.
export default function FallbackImage({ src, alt = "", className = "", imgClassName = "", ...props }) {
  const [errored, setErrored] = useState(false);

  if (errored) {
    return (
      <div
        role="img"
        aria-label={alt}
        className={`flex items-center justify-center bg-gradient-to-br from-surface2 via-surface to-black ${className}`}
      >
        <Dumbbell size={28} className="text-white/15" strokeWidth={1.5} />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      loading="lazy"
      onError={() => setErrored(true)}
      className={`${className} ${imgClassName}`}
      {...props}
    />
  );
}

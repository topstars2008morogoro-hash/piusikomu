import React, { useState } from 'react';

interface SchoolLogoProps {
  className?: string;
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  showLabel?: boolean;
}

export const SchoolLogo: React.FC<SchoolLogoProps> = ({
  className = '',
  size = 'md',
  showLabel = false,
}) => {
  const [imgError, setImgError] = useState(false);

  const sizeClasses = {
    xs: 'w-6 h-6',
    sm: 'w-9 h-9',
    md: 'w-12 h-12',
    lg: 'w-20 h-20',
    xl: 'w-28 h-28',
  }[size];

  return (
    <div className={`inline-flex items-center gap-2.5 ${className}`}>
      <div className={`relative flex-shrink-0 ${sizeClasses} rounded-full overflow-hidden bg-white shadow-md border-2 border-amber-500/50 p-0.5 group`}>
        {!imgError ? (
          <img
            src="/top_stars_logo.jpg"
            alt="Top Stars Nursery and Primary School Logo"
            referrerPolicy="no-referrer"
            onError={() => setImgError(true)}
            className="w-full h-full object-contain rounded-full transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          /* High-Fidelity SVG Vector Emblem matching official uploaded school crest */
          <svg
            viewBox="0 0 300 300"
            className="w-full h-full drop-shadow-sm select-none"
            xmlns="http://www.w3.org/2000/svg"
          >
            {/* Outer Circular Crest Border */}
            <circle cx="150" cy="135" r="108" fill="#FFFDF8" stroke="#8B4513" strokeWidth="6" />
            <circle cx="150" cy="135" r="102" fill="none" stroke="#C88A3E" strokeWidth="2" strokeDasharray="4 2" />

            {/* Circular Path for Text */}
            <defs>
              <path
                id="textPathTop"
                d="M 52,145 A 98,98 0 0,1 248,145"
                fill="none"
              />
            </defs>

            <text fill="#5C2C09" fontSize="13" fontWeight="900" letterSpacing="1.2" textAnchor="middle">
              <textPath href="#textPathTop" startOffset="50%">
                TOP STARS NURSERY AND PRIMARY SCHOOL
              </textPath>
            </text>

            {/* Center 5-Pointed Star with faceted red/coral highlights */}
            <g transform="translate(150, 95)">
              {/* Star Outline and Fill */}
              <polygon
                points="0,-32 10,-10 32,-8 15,9 20,31 0,18 -20,31 -15,9 -32,-8 -10,-10"
                fill="#E84A36"
                stroke="#8B2500"
                strokeWidth="2"
              />
              {/* Star Facets for 3D Shading */}
              <polygon points="0,-32 0,18 10,-10" fill="#FF8E72" opacity="0.9" />
              <polygon points="32,-8 0,18 15,9" fill="#FF8E72" opacity="0.9" />
              <polygon points="20,31 0,18 0,0" fill="#B22222" opacity="0.6" />
              <polygon points="-20,31 0,18 0,0" fill="#B22222" opacity="0.7" />
              <polygon points="-32,-8 0,18 -15,9" fill="#FF6B4A" opacity="0.9" />
              <polygon points="0,-32 0,18 -10,-10" fill="#FFF0ED" opacity="0.85" />
            </g>

            {/* Center Open Book */}
            <g transform="translate(150, 160)">
              {/* Left Page (Blue Spine/Cover & White Pages) */}
              <path
                d="M -3 -15 C -15 -18 -32 -20 -44 -14 L -44 14 C -32 8 -15 10 -3 13 Z"
                fill="#F8FAFC"
                stroke="#1E3A8A"
                strokeWidth="2.5"
              />
              {/* Right Page */}
              <path
                d="M 3 -15 C 15 -18 32 -20 44 -14 L 44 14 C 32 8 15 10 3 13 Z"
                fill="#F8FAFC"
                stroke="#1E3A8A"
                strokeWidth="2.5"
              />
              {/* Book Spine */}
              <path d="M -3 -15 L -3 13 L 0 15 L 3 13 L 3 -15 Z" fill="#2563EB" />
              {/* Lines representing text in the book */}
              <line x1="-36" y1="-7" x2="-12" y2="-8" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="-36" y1="-1" x2="-12" y2="-2" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="-36" y1="5" x2="-12" y2="4" stroke="#94A3B8" strokeWidth="1.5" />

              <line x1="12" y1="-8" x2="36" y2="-7" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="12" y1="-2" x2="36" y2="-1" stroke="#94A3B8" strokeWidth="1.5" />
              <line x1="12" y1="4" x2="36" y2="5" stroke="#94A3B8" strokeWidth="1.5" />
            </g>

            {/* Bottom Scroll Ribbon: ETHICS - QUALITY EDUCATION - VALUES */}
            {/* Left Ribbon */}
            <g transform="translate(0, 220)">
              <path d="M 32,15 L 75,0 L 105,18 L 65,30 Z" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
              <text x="70" y="19" fontSize="10" fontWeight="900" fill="#78350F" textAnchor="middle">ETHICS</text>

              {/* Right Ribbon */}
              <path d="M 268,15 L 225,0 L 195,18 L 235,30 Z" fill="#FDE68A" stroke="#78350F" strokeWidth="2" />
              <text x="230" y="19" fontSize="10" fontWeight="900" fill="#78350F" textAnchor="middle">VALUES</text>

              {/* Center Plaque */}
              <rect x="90" y="10" width="120" height="26" rx="2" fill="#FEF3C7" stroke="#78350F" strokeWidth="2.5" />
              <text x="150" y="27" fontSize="11" fontWeight="900" fill="#78350F" textAnchor="middle" letterSpacing="0.8">
                QUALITY EDUCATION
              </text>
            </g>
          </svg>
        )}
      </div>

      {showLabel && (
        <div className="flex flex-col">
          <span className="text-xs font-black text-white tracking-tight uppercase leading-none">
            Top Stars School
          </span>
          <span className="text-[10px] text-amber-400 font-medium leading-tight">
            Morogoro, Tanzania
          </span>
        </div>
      )}
    </div>
  );
};

import React from "react";

export interface SalinoLogoProps {
  variant?: "navbar" | "master" | "mark";
  className?: string;
  ariaLabel?: string;
}

export const SalinoLogo: React.FC<SalinoLogoProps> = ({
  variant = "navbar",
  className = "h-12 w-auto",
  ariaLabel = "Salino Project Management Logo",
}) => {
  if (variant === "mark") {
    return (
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 120 120" role="img" aria-label={ariaLabel} className={className}>
        <rect width="120" height="120" rx="22" fill="#000000" stroke="#B8522E" strokeWidth="1.5" strokeOpacity="0.4" />
        <line x1="22" y1="98" x2="96" y2="24" stroke="#B8522E" strokeWidth="1.5" strokeOpacity="0.35" />
        <path d="M 76,34 C 70,22 56,18 44,18 C 27,18 17,27 17,39 C 17,52 30,57 47,61 C 65,65 78,71 78,86 C 78,100 64,108 45,108 C 28,108 17,100 13,88" fill="none" stroke="#EDEAE4" strokeWidth="9.5" strokeLinecap="round" />
        <circle cx="96" cy="24" r="7.5" fill="#B8522E" />
      </svg>
    );
  }

  const isMaster = variant === "master";

  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox={isMaster ? "0 0 820 300" : "140 65 540 185"} role="img" aria-label={ariaLabel} className={className}>
      {isMaster && (
        <>
          <rect width="820" height="300" rx="18" fill="#000000" />
          <g aria-hidden="true">
            <line x1="665" y1="18" x2="735" y2="62" stroke="#B8522E" strokeWidth="1.3" strokeOpacity="0.45" />
            <line x1="735" y1="62" x2="792" y2="32" stroke="#B8522E" strokeWidth="1.3" strokeOpacity="0.45" />
            <line x1="735" y1="62" x2="768" y2="128" stroke="#B8522E" strokeWidth="1.3" strokeOpacity="0.45" />
            <line x1="665" y1="18" x2="695" y2="102" stroke="#B8522E" strokeWidth="1.3" strokeOpacity="0.45" />
            <line x1="695" y1="102" x2="768" y2="128" stroke="#B8522E" strokeWidth="1.3" strokeOpacity="0.45" />
            <line x1="735" y1="62" x2="695" y2="102" stroke="#B8522E" strokeWidth="1.3" strokeOpacity="0.45" />
            <circle cx="665" cy="18" r="3.2" fill="#B8522E" fillOpacity="0.75" />
            <circle cx="735" cy="62" r="4.2" fill="#B8522E" fillOpacity="0.75" />
            <circle cx="792" cy="32" r="3.2" fill="#B8522E" fillOpacity="0.75" />
            <circle cx="768" cy="128" r="3.5" fill="#B8522E" fillOpacity="0.75" />
            <circle cx="695" cy="102" r="3.2" fill="#B8522E" fillOpacity="0.75" />
            <line x1="28" y1="205" x2="88" y2="242" stroke="#B8522E" strokeWidth="1.3" strokeOpacity="0.45" />
            <line x1="88" y1="242" x2="58" y2="285" stroke="#B8522E" strokeWidth="1.3" strokeOpacity="0.45" />
            <line x1="88" y1="242" x2="148" y2="272" stroke="#B8522E" strokeWidth="1.3" strokeOpacity="0.45" />
            <line x1="28" y1="205" x2="58" y2="285" stroke="#B8522E" strokeWidth="1.3" strokeOpacity="0.45" />
            <circle cx="28" cy="205" r="3.2" fill="#B8522E" fillOpacity="0.75" />
            <circle cx="88" cy="242" r="4.2" fill="#B8522E" fillOpacity="0.75" />
            <circle cx="58" cy="285" r="3.2" fill="#B8522E" fillOpacity="0.75" />
            <circle cx="148" cy="272" r="3.2" fill="#B8522E" fillOpacity="0.75" />
          </g>
        </>
      )}
      <g transform="translate(150, 76)">
        <path d="M 68,18 C 62,6 48,2 34,2 C 15,2 4,11 4,24 C 4,38 18,43 36,47 C 56,51 70,57 70,73 C 70,89 55,98 35,98 C 17,98 4,90 0,77" fill="none" stroke="#EDEAE4" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
        <path d="M 98,97 L 136,4 L 174,97" fill="none" stroke="#EDEAE4" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="111" y1="68" x2="161" y2="68" fill="none" stroke="#EDEAE4" strokeWidth="9.5" strokeLinecap="round" />
        <polyline points="206,4 206,96 264,96" fill="none" stroke="#EDEAE4" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
        <line x1="298" y1="28" x2="298" y2="96" fill="none" stroke="#B8522E" strokeWidth="10.5" strokeLinecap="round" />
        <circle cx="298" cy="7" r="6.8" fill="#B8522E" />
        <polyline points="334,96 334,5 402,95 402,4" fill="none" stroke="#EDEAE4" strokeWidth="9.5" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="472" cy="50" r="46" fill="none" stroke="#EDEAE4" strokeWidth="9.5" />
      </g>
      <g fill="none" stroke="#B8522E" strokeWidth="2.2" strokeLinecap="square" strokeLinejoin="miter">
        <path d="M 207.5,237.5 L 207.5,222 L 213.3,222 C 218.1,222 218.1,230.1 213.3,230.1 L 207.5,230.1" />
        <path d="M 229.6,237.5 L 229.6,222 L 235.4,222 C 240.3,222 240.3,229.8 235.4,229.8 L 229.6,229.8 M 234.6,229.8 L 240.1,237.5" />
        <ellipse cx="258.7" cy="229.8" rx="6.6" ry="7.8" />
        <path d="M 285.8,222 L 285.8,232.5 C 285.8,238.3 277.3,238.3 277.3,233.2" />
        <path d="M 307.4,222 L 297.8,222 L 297.8,237.5 L 307.4,237.5 M 297.8,229.8 L 305.7,229.8" />
        <path d="M 331.0,225.4 C 328.9,221.4 319.4,221.4 319.4,229.8 C 319.4,238.1 328.9,238.1 331.0,234.1" />
        <path d="M 343.0,222 L 353.6,222 M 348.3,222 L 348.3,237.5" />
        <polyline points="386.1,237.5 386.1,222 393.2,231.6 400.4,222 400.4,237.5" />
        <path d="M 412.4,237.5 L 418.4,222 L 424.5,237.5 M 414.6,232.5 L 422.3,232.5" />
        <polyline points="436.5,237.5 436.5,222 448.1,237.5 448.1,222" />
        <path d="M 460.1,237.5 L 466.1,222 L 472.2,237.5 M 462.3,232.5 L 470.0,232.5" />
        <path d="M 496.3,225.4 C 494.1,221.4 484.2,221.4 484.2,229.8 C 484.2,238.1 495.0,238.1 496.9,233.6 L 496.9,230.1 L 491.2,230.1" />
        <path d="M 518.5,222 L 508.9,222 L 508.9,237.5 L 518.5,237.5 M 508.9,229.8 L 516.8,229.8" />
        <polyline points="530.5,237.5 530.5,222 537.6,231.6 544.8,222 544.8,237.5" />
        <path d="M 566.4,222 L 556.8,222 L 556.8,237.5 L 566.4,237.5 M 556.8,229.8 L 564.7,229.8" />
        <polyline points="578.4,237.5 578.4,222 590.0,237.5 590.0,222" />
        <path d="M 602.0,222 L 612.5,222 M 607.3,222 L 607.3,237.5" />
      </g>
    </svg>
  );
};

export default SalinoLogo;

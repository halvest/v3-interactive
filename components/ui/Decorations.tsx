export const HandDrawnStar = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 stroke-text-primary ${className}`}
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C12 2 12 10 20 12C12 14 12 22 12 22C12 22 12 14 4 12C12 10 12 2 12 2Z" fill="currentColor" fillOpacity="0.1"/>
  </svg>
);

export const HandDrawnSparkle = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-4 h-4 stroke-text-primary ${className}`}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 4V20M4 12H20M7 7L17 17M17 7L7 17" opacity="0.8" />
  </svg>
);

export const AbstractFlower = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 stroke-text-primary ${className}`}
    strokeWidth="1"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M12 2C12 2 14 8 16 9C18 10 22 8 22 8C22 8 19 13 18 15C17 17 21 21 21 21C21 21 15 19 13 18C11 17 8 22 8 22C8 22 10 16 9 14C8 12 2 10 2 10C2 10 7 8 9 7C11 6 12 2 12 2Z" fill="currentColor" fillOpacity="0.05"/>
  </svg>
);

export const PaperClip = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 stroke-text-primary ${className}`}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M10 15V8C10 6.89543 10.8954 6 12 6C13.1046 6 14 6.89543 14 8V17C14 19.2091 12.2091 21 10 21C7.79086 21 6 19.2091 6 17V8" opacity="0.7"/>
  </svg>
);

export const ScribbleUnderline = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 10" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-auto stroke-text-primary ${className}`}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
    preserveAspectRatio="none"
  >
    <path d="M2 7C20 3 40 5 60 4C75 3 90 6 98 5" opacity="0.6"/>
  </svg>
);

export const HandDrawnArrow = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 24 24" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-6 h-6 stroke-text-primary ${className}`}
    strokeWidth="1.5"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M5 12C10 12 14 10 19 8M19 8C18 10 16 14 16 14M19 8C17 7 13 5 13 5" opacity="0.8"/>
  </svg>
);

export const HandDrawnCircle = ({ className = "" }: { className?: string }) => (
  <svg 
    viewBox="0 0 100 100" 
    fill="none" 
    xmlns="http://www.w3.org/2000/svg"
    className={`w-full h-full stroke-text-primary ${className}`}
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
  >
    <path d="M50 5C75 4 96 22 95 48C94 75 70 96 45 94C22 92 4 68 6 42C8 20 30 6 52 8C65 9 76 18 80 30" opacity="0.6"/>
  </svg>
);

export const PaperTape = ({ className = "" }: { className?: string }) => (
  <div 
    className={`absolute bg-white/55 shadow-[0_1px_3px_rgba(0,0,0,0.05)] ${className}`}
    style={{
      maskImage: 'url("data:image/svg+xml,%3Csvg width=\'100%25\' height=\'100%25\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Crect width=\'100%25\' height=\'100%25\' rx=\'2\' fill=\'black\' /%3E%3C/svg%3E")',
      border: '1px solid rgba(255, 255, 255, 0.4)',
      boxShadow: 'inset 0 0 10px rgba(0,0,0,0.02)'
    }}
  />
);

export const PhotoCorners = () => (
  <>
    <div className="absolute -top-1 -left-1 w-3 h-3 border-t border-l border-border-strong opacity-50 z-20" />
    <div className="absolute -top-1 -right-1 w-3 h-3 border-t border-r border-border-strong opacity-50 z-20" />
    <div className="absolute -bottom-1 -left-1 w-3 h-3 border-b border-l border-border-strong opacity-50 z-20" />
    <div className="absolute -bottom-1 -right-1 w-3 h-3 border-b border-r border-border-strong opacity-50 z-20" />
  </>
);

import { Reason, WhyYouContent } from "@/content/surprise";
import { PaperTape } from "@/components/ui/Decorations";
import { PixelHeartSmall } from "@/components/ui/PixelAssets";

interface WhyYouSectionProps {
  reasons: Reason[];
  content: WhyYouContent;
}

export function WhyYouSection({ reasons, content }: WhyYouSectionProps) {
  // Deterministic rotations for physical feeling
  const rotations = [-0.6, 0.8, -0.4];
  const paperColors = ["bg-surface", "bg-sky-soft", "bg-coral-soft", "bg-sage-light"];
  const tapes = [
    { top: "-12px", left: "50%", rotate: "-2deg" },
    { top: "-10px", right: "20px", rotate: "4deg" },
    { top: "10px", left: "-15px", rotate: "-80deg" }
  ];

  return (
    <section className="w-full py-24 md:py-32 px-5 md:px-8 flex flex-col items-center overflow-hidden">
      <div className="w-full max-w-2xl flex flex-col items-center relative">
        <div className="w-full max-w-lg self-start mb-14 md:mb-20">
          <span className="text-caption text-text-muted uppercase tracking-[0.16em] block mb-3">
            <span className="pixel-label text-plum">{content.eyebrow}</span>
          </span>
          <h2 className="text-heading-1 text-text-primary [text-wrap:balance]">{content.heading}</h2>
          {content.lead && (
            <p className="text-body text-text-muted max-w-md mt-4 [text-wrap:pretty]">{content.lead}</p>
          )}
        </div>
        
        {reasons.map((reason, index) => {
          const rotation = rotations[index % rotations.length];
          const tape = tapes[index % tapes.length];
          const isEven = index % 2 === 1;
          
          return (
            <div 
              key={index}
              className={`flex flex-col w-full max-w-md ${isEven ? 'md:ml-24' : 'md:mr-24'} relative z-10 ${index > 0 ? 'mt-5 md:-mt-3' : ''}`}
              style={{ transform: `rotate(${rotation}deg)` }}
            >
              {/* Paper Note */}
              <div className={`${paperColors[index % paperColors.length]} rounded-sm border border-border-subtle p-6 md:p-8 shadow-paper relative`}>
                
                {/* Paper Tape */}
                <div 
                  className="absolute z-20"
                  style={{ 
                    top: tape.top, 
                    left: tape.left, 
                    right: tape.right,
                    transform: `translate(-50%, 0) rotate(${tape.rotate})` 
                  }}
                >
                  <PaperTape className="w-16 h-6" />
                </div>

                {/* Handwritten Number Annotation */}
                <span className="absolute -top-3 -left-2 inline-flex items-center gap-1.5 bg-bg px-2 py-1 font-mono text-[10px] tracking-[0.16em] text-plum border border-border-subtle">
                  <PixelHeartSmall className="text-love" />0{index + 1}
                </span>
                
                <h3 className="text-heading-2 text-text-primary mb-3">
                  {reason.title}
                </h3>
                
                <p className="text-body text-text-muted [text-wrap:pretty]">
                  {reason.content}
                </p>
                
              </div>
            </div>
          );
        })}
        
      </div>
    </section>
  );
}

import React from 'react';

const processDiagramImg = '/images/process_diagram_1784685228956.jpg';

interface DoubleDiamondProps {
  isDarkMode: boolean;
}

interface StageCardProps {
  id: number;
  title: string;
  deliverables: string[];
  isDarkMode: boolean;
  bodyText: string;
}

const StageCard: React.FC<StageCardProps> = ({
  id,
  title,
  deliverables,
  isDarkMode,
  bodyText,
}) => {
  const cardClass = isDarkMode
    ? "p-6 rounded-none border border-white/10 bg-white/[0.04] text-white flex flex-col justify-between h-full"
    : "p-6 rounded-none border border-slate-200 bg-white text-slate-700 flex flex-col justify-between h-full";

  return (
    <div className={cardClass}>
      <div className="space-y-4">
        <div>
          <span className="text-hero font-sans font-extrabold tracking-tight text-space-sparkle block leading-none mb-3">
            0{id}
          </span>
          <h4 className="font-sans text-h2 font-bold tracking-tight">{title}</h4>
        </div>

        <div className="space-y-2 pt-2">
          <span className={`text-caption font-sans uppercase tracking-wider font-bold block ${isDarkMode ? "text-white/90" : "text-slate-800"}`}>
            Key Deliverables
          </span>
          <ul className="space-y-1.5">
            {deliverables.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2 text-caption font-light">
                <span className={isDarkMode ? "text-white font-semibold" : "text-slate-700 font-semibold"}>•</span>
                <span className={bodyText}>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export const DoubleDiamond: React.FC<DoubleDiamondProps> = ({ isDarkMode }) => {
  const bodyText = isDarkMode ? "text-white/80 font-light" : "text-slate-600 font-light";

  return (
    <div id="double-diamond-diagram-container" className="space-y-12 w-full">
      {/* Process Model Infographic Image */}
      <div className="w-full flex justify-center py-2">
        <div className={`relative max-w-5xl w-full rounded-none overflow-hidden border shadow-xl transition-all duration-300 ${
          isDarkMode ? 'border-space-sparkle/30 bg-vintage-charcoal/50' : 'border-slate-300 bg-white'
        }`}>
          <img
            src={processDiagramImg}
            alt="ATBP Collaborative Double Diamond Process Model Diagram"
            className="w-full h-auto object-cover block"
            referrerPolicy="no-referrer"
          />
        </div>
      </div>

      {/* THREE HORIZONTAL COHESIVE CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          {
            id: 1,
            title: "The Design Stage",
            deliverables: [
              "Site orientation & solar diagnostics",
              "Conceptual space programming Matrix",
              "Schematic floor layouts & volumetric studies",
            ],
          },
          {
            id: 2,
            title: "The Technical Stage",
            deliverables: [
              "High-resolution technical models",
              "MEPFS & structural integrations",
              "Permit-ready drawing blueprint sets",
            ],
          },
          {
            id: 3,
            title: "The Construction Stage",
            deliverables: [
              "Builder procurement & bidding alignment",
              "Rigid on-site inspection compliance",
              "Final verification check & finished building",
            ],
          },
        ].map((card) => (
          <StageCard
            key={card.id}
            id={card.id}
            title={card.title}
            deliverables={card.deliverables}
            isDarkMode={isDarkMode}
            bodyText={bodyText}
          />
        ))}
      </div>
    </div>
  );
};

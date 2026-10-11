import React, { useState } from 'react';

interface BeforeAfterSliderProps {
  beforePhoto: string;
  afterPhoto: string;
  beforeLabel?: string;
  afterLabel?: string;
}

export const BeforeAfterSlider: React.FC<BeforeAfterSliderProps> = ({
  beforePhoto,
  afterPhoto,
  beforeLabel = 'Before Action',
  afterLabel = 'After Community Action',
}) => {
  const [sliderPosition, setSliderPosition] = useState<number>(50);

  const handleSliderMove = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSliderPosition(Number(e.target.value));
  };

  return (
    <div className="relative w-full h-72 sm:h-80 rounded-xl overflow-hidden select-none border border-slate-200 shadow-sm bg-slate-900">
      {/* After image (background) */}
      <img
        src={afterPhoto}
        alt="After"
        referrerPolicy="no-referrer"
        className="absolute inset-0 w-full h-full object-cover"
      />

      {/* Before image (clipped over) */}
      <div
        className="absolute inset-0 overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={beforePhoto}
          alt="Before"
          referrerPolicy="no-referrer"
          className="absolute inset-0 w-full h-full object-cover max-w-none"
          style={{ width: '100%' }}
        />
      </div>

      {/* Divider line & handle */}
      <div
        className="absolute top-0 bottom-0 w-0.5 bg-white shadow-lg pointer-events-none"
        style={{ left: `${sliderPosition}%` }}
      >
        <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white shadow-md flex items-center justify-center text-slate-800 text-xs font-bold border border-slate-300">
          ↔
        </div>
      </div>

      {/* Badges */}
      <div className="absolute top-3 left-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
        {beforeLabel}
      </div>
      <div className="absolute top-3 right-3 bg-black/60 backdrop-blur-xs text-white text-[11px] font-semibold px-2 py-0.5 rounded">
        {afterLabel}
      </div>

      {/* Range input slider */}
      <input
        type="range"
        min="0"
        max="100"
        value={sliderPosition}
        onChange={handleSliderMove}
        className="absolute inset-0 w-full h-full opacity-0 cursor-ew-resize z-20"
        aria-label="Before after comparison slider"
      />
    </div>
  );
};

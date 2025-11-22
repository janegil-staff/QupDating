"use client";

export default function AgeRangeSlider({
  min = 18,
  max = 99,
  value = [25, 40],
  onChange,
}) {
  const [minVal, maxVal] = value;

  const handleMinChange = (e) => {
    const newMin = Number(e.target.value);
    if (newMin > maxVal) {
      onChange([maxVal, maxVal]); // prevent overlap
    } else {
      onChange([newMin, maxVal]);
    }
  };

  const handleMaxChange = (e) => {
    const newMax = Number(e.target.value);
    if (newMax < minVal) {
      onChange([minVal, minVal]); // prevent overlap
    } else {
      onChange([minVal, newMax]);
    }
  };

  return (
    <div className="w-full">
      <label className="block text-gray-300 mb-2">Preferred Age Range</label>
      <div className="flex flex-col gap-2">
        <input
          type="range"
          min={min}
          max={max}
          value={minVal}
          onChange={handleMinChange}
          className="w-full accent-pink-500"
        />
        <input
          type="range"
          min={min}
          max={max}
          value={maxVal}
          onChange={handleMaxChange}
          className="w-full accent-pink-500"
        />
      </div>
      <p className="text-gray-400 mt-2">
        From <span className="text-pink-400 font-bold">{minVal}</span> to{" "}
        <span className="text-pink-400 font-bold">{maxVal}</span>
      </p>
    </div>
  );
}

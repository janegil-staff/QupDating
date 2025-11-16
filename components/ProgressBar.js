function ProgressBar({ value }) {
  return (
    <div className="w-full bg-gray-700 rounded-full h-4 mt-4">
      <div
        className="bg-pink-600 h-4 rounded-full transition-all duration-500 ease-out"
        style={{ width: `${value}%` }}
      />
    </div>
  );
}
export default ProgressBar;
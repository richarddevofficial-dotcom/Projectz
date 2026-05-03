export default function Loader() {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex items-center justify-center z-50">
      <div className="relative">
        <div className="w-16 h-16 border-4 border-gray-200 border-t-primary rounded-full animate-spin"></div>
        <div className="mt-4 text-primary font-semibold">Loading...</div>
      </div>
    </div>
  );
}

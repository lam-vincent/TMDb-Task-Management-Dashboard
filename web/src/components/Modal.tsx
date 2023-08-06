export function Modal({
  open,
  onClose,
  children,
}: {
  open: boolean;
  onClose: () => void;
  children: JSX.Element;
}) {
  if (!open) return null;
  return (
    <>
      <div className="p-4 rounded absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 bg-white z-50 shadow">
        <button onClick={onClose} className="flex justify-end mb-1 w-full">
          {/* cross icon */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 352 512"
            height="1em"
          >
            <path
              fill="currentColor"
              d="M213.25 256l120.38 120.4c6.25 6.25 6.25 16.38 0 22.63l-22.63 22.63c-6.25 6.25-16.38 6.25-22.63 0L168 300.87 47.62 421.25c-6.25 6.25-16.38 6.25-22.63 0l-22.63-22.63c-6.25-6.25-6.25-16.38 0-22.63L124.75 256 4.37 135.62c-6.25-6.25-6.25-16.38 0-22.63l22.63-22.63c6.25-6.25 16.38-6.25 22.63 0L168 211.13 288.38 90.75c6.25-6.25 16.38-6.25 22.63 0l22.63 22.63c6.25 6.25 6.25 16.38 0 22.63L213.25 256z"
            />
          </svg>
        </button>
        <div>{children}</div>
      </div>
      <div
        onClick={onClose}
        className="absolute w-full h-full z-40 bg-black/20"
      ></div>
    </>
  );
}

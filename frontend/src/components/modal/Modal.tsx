interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
}

export default function Modal({ children, onClose }: ModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">

      {/* BACKDROP */}
      <div
        className="absolute inset-0 bg-black/40"
        onClick={onClose}
      />

      {/* CONTENT */}
      <div className="relative bg-white rounded-2xl shadow-xl w-full max-w-2xl z-10">
        {children}
      </div>

    </div>
  );
}
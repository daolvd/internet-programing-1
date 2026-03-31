import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";

type ConfirmTone = "danger" | "default";

interface ConfirmOptions {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  tone?: ConfirmTone;
}

interface ConfirmDialogState extends ConfirmOptions {
  isOpen: boolean;
}

interface ConfirmContextValue {
  confirm: (options: ConfirmOptions | string) => Promise<boolean>;
}

const ConfirmContext = createContext<ConfirmContextValue | null>(null);

export function ConfirmProvider({ children }: { children: React.ReactNode }) {
  const [dialog, setDialog] = useState<ConfirmDialogState>({
    isOpen: false,
    title: "Confirm Action",
    message: "Are you sure?",
    confirmText: "Confirm",
    cancelText: "Cancel",
    tone: "default",
  });
  const [resolver, setResolver] = useState<((value: boolean) => void) | null>(null);
  const dialogRef = useRef<HTMLDivElement | null>(null);

  const closeDialog = useCallback((value: boolean) => {
    if (resolver) resolver(value);
    setResolver(null);
    setDialog((prev) => ({ ...prev, isOpen: false }));
  }, [resolver]);

  const confirm = (options: ConfirmOptions | string) => {
    const normalized: ConfirmOptions =
      typeof options === "string" ? { message: options } : options;

    setDialog({
      isOpen: true,
      title: normalized.title || "Confirm Action",
      message: normalized.message,
      confirmText: normalized.confirmText || "Confirm",
      cancelText: normalized.cancelText || "Cancel",
      tone: normalized.tone || "default",
    });

    return new Promise<boolean>((resolve) => {
      setResolver(() => resolve);
    });
  };

  const value = useMemo(() => ({ confirm }), []);

  useEffect(() => {
    if (!dialog.isOpen) return;

    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLButtonElement>("button")?.focus();

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        event.preventDefault();
        closeDialog(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [closeDialog, dialog.isOpen]);

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 px-4">
          <div
            ref={dialogRef}
            role="alertdialog"
            aria-modal="true"
            aria-labelledby="confirm-title"
            aria-describedby="confirm-message"
            className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl"
          >
            <h3 id="confirm-title" className="text-lg font-semibold text-gray-800">
              {dialog.title}
            </h3>
            <p id="confirm-message" className="mt-2 text-sm text-gray-600">
              {dialog.message}
            </p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="rounded-lg border border-gray-200 px-4 py-2 text-sm text-gray-700 transition-colors duration-150 hover:bg-gray-50 active:bg-gray-100"
                onClick={() => closeDialog(false)}
              >
                {dialog.cancelText}
              </button>
              <button
                type="button"
                className={`rounded-lg px-4 py-2 text-sm text-white transition-colors duration-150 ${
                  dialog.tone === "danger" ? "bg-red-600 hover:bg-red-700 active:bg-red-800" : "bg-blue-600 hover:bg-blue-700 active:bg-blue-800"
                }`}
                onClick={() => closeDialog(true)}
              >
                {dialog.confirmText}
              </button>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
}

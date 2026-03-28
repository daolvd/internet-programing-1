import { createContext, useContext, useMemo, useState } from "react";

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

  const closeDialog = (value: boolean) => {
    if (resolver) resolver(value);
    setResolver(null);
    setDialog((prev) => ({ ...prev, isOpen: false }));
  };

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

  return (
    <ConfirmContext.Provider value={value}>
      {children}
      {dialog.isOpen && (
        <div className="fixed inset-0 z-[1100] flex items-center justify-center bg-black/40 px-4">
          <div className="w-full max-w-md rounded-xl bg-white p-5 shadow-xl">
            <h3 className="text-lg font-semibold text-gray-800">{dialog.title}</h3>
            <p className="mt-2 text-sm text-gray-600">{dialog.message}</p>

            <div className="mt-5 flex justify-end gap-2">
              <button
                type="button"
                className="px-4 py-2 text-sm rounded-lg border border-gray-200 text-gray-700 hover:bg-gray-50"
                onClick={() => closeDialog(false)}
              >
                {dialog.cancelText}
              </button>
              <button
                type="button"
                className={`px-4 py-2 text-sm rounded-lg text-white ${
                  dialog.tone === "danger" ? "bg-red-600 hover:bg-red-700" : "bg-blue-600 hover:bg-blue-700"
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

export function useConfirm() {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within ConfirmProvider");
  }
  return context;
}

import { createContext, useContext, useMemo, useState } from "react";

type NotificationType = "success" | "error" | "warning";

interface NotificationState {
  message: string;
  type: NotificationType;
}

interface NotificationContextValue {
  notify: (message: string, type?: NotificationType) => void;
}

const NotificationContext = createContext<NotificationContextValue | null>(null);

export function NotificationProvider({ children }: { children: React.ReactNode }) {
  const [notification, setNotification] = useState<NotificationState | null>(null);

  const notify = (message: string, type: NotificationType = "success") => {
    setNotification({ message, type });

    window.setTimeout(() => {
      setNotification((prev) => (prev?.message === message ? null : prev));
    }, 2500);
  };

  const value = useMemo(() => ({ notify }), []);

  return (
    <NotificationContext.Provider value={value}>
      {children}
      {notification && (
        <div className="fixed top-4 right-4 z-[1000]">
          <div
            className={`rounded-lg px-4 py-3 shadow-lg text-white min-w-[280px] border ${
              notification.type === "success"
                ? "bg-green-600 border-green-700"
                : notification.type === "error"
                  ? "bg-red-600 border-red-700"
                  : "bg-amber-500 border-amber-600"
            }`}
          >
            <p className="text-sm font-medium">{notification.message}</p>
          </div>
        </div>
      )}
    </NotificationContext.Provider>
  );
}

// eslint-disable-next-line react-refresh/only-export-components
export function useNotification() {
  const context = useContext(NotificationContext);
  if (!context) {
    throw new Error("useNotification must be used within NotificationProvider");
  }
  return context;
}

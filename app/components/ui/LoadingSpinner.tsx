import { Loader2 } from "lucide-react";

interface LoadingSpinnerProps {
  message?: string;
  submessage?: string;
}

export default function LoadingSpinner({
  message = "Loading...",
  submessage,
}: LoadingSpinnerProps) {
  return (
    <div
      className="flex flex-col items-center justify-center py-10 gap-3"
      role="status"
      aria-label={message}
    >
      <Loader2 className="w-8 h-8 t-accent animate-spin" />
      <p className="t-text font-medium text-sm">{message}</p>
      {submessage && <p className="t-muted text-xs">{submessage}</p>}
    </div>
  );
}

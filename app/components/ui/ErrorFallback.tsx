import { ShieldAlert, RefreshCw } from "lucide-react";

interface ErrorFallbackProps {
  title?: string;
  message?: string;
  onRetry?: () => void;
}

export default function ErrorFallback({
  title = "Something went wrong",
  message = "An unexpected error occurred. Please try again.",
  onRetry,
}: ErrorFallbackProps) {
  return (
    <div
      className="t-card border border-red-500/30 bg-red-500/5 rounded-2xl sm:rounded-3xl p-6 sm:p-8 text-center"
      role="alert"
    >
      <ShieldAlert className="w-12 h-12 text-red-500 mx-auto mb-4" />
      <h3 className="text-xl font-bold text-red-600 dark:text-red-400 mb-2">
        {title}
      </h3>
      <p className="text-sm text-red-600/80 dark:text-red-400/80 mb-6 max-w-md mx-auto">
        {message}
      </p>
      {onRetry && (
        <button
          onClick={onRetry}
          aria-label="Retry"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/30 hover:bg-red-500/20 transition-colors font-medium text-sm focus:outline-none focus-visible:ring-2 focus-visible:ring-red-500 active:scale-95"
        >
          <RefreshCw className="w-4 h-4" />
          Try Again
        </button>
      )}
    </div>
  );
}

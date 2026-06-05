function ErrorState({ message = "Something went wrong", error }) {
  return (
    <div className="mt-6 rounded-2xl border border-red-900 bg-red-950/40 p-6 text-red-300">
      {message}
      {error?.message && (
        <span>: {error.message}</span>
      )}
    </div>
  );
}

export default ErrorState;
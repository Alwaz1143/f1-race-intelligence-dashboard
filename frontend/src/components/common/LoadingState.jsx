function LoadingState({ message = "Loading..." }) {
  return (
    <div className="mt-6 rounded-2xl border border-slate-800 bg-slate-900/60 p-6 text-slate-400">
      {message}
    </div>
  );
}

export default LoadingState;
"use client";
import { useState, useEffect } from "react";
import { Lock } from "lucide-react";

export default function AuthGuard({ children }: { children: React.ReactNode }) {
  const [unlocked, setUnlocked] = useState(false);
  const [checked, setChecked] = useState(false);
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const auth = sessionStorage.getItem("auth");
    if (auth === "true") setUnlocked(true);
    setChecked(true);
  }, []);

  const handleSubmit = async () => {
    if (!password.trim()) return;
    setLoading(true);
    setError("");

    const res = await fetch("/api/auth", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password }),
    });

    if (res.ok) {
      sessionStorage.setItem("auth", "true");
      setUnlocked(true);
    } else {
      setError("Wrong password");
    }
    setLoading(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleSubmit();
  };

  if (!checked) return null;

  if (!unlocked) {
    return (
      <div className="flex items-center justify-center h-screen w-screen bg-gray-50 dark:bg-gray-950">
        <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm p-8 w-full max-w-sm flex flex-col items-center gap-6">
          <div className="w-12 h-12 rounded-xl bg-[#1a1a2e] flex items-center justify-center shadow-md">
            <span className="text-white font-bold text-xl">X</span>
          </div>
          <div className="text-center">
            <h1 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
              X Stream
            </h1>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">
              Enter password to continue
            </p>
          </div>
          <div className="w-full flex flex-col gap-3">
            <div className="relative">
              <Lock
                size={14}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400"
              />
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Password"
                autoFocus
                className="w-full pl-9 pr-4 py-2.5 text-sm rounded-lg border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800 text-gray-800 dark:text-gray-100 placeholder-gray-400 dark:placeholder-gray-500 outline-none focus:border-[#1a1a2e] dark:focus:border-gray-500 transition-colors"
              />
            </div>
            {error && (
              <p className="text-xs text-red-500 text-center">{error}</p>
            )}
            <button
              onClick={handleSubmit}
              disabled={loading || !password.trim()}
              className="w-full py-2.5 rounded-lg bg-[#1a1a2e] text-white text-sm font-medium hover:opacity-90 transition-opacity disabled:opacity-40 cursor-pointer"
            >
              {loading ? "Checking..." : "Unlock"}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}

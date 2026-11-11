"use client";

import React, { useState } from "react";
import { SchoolIcon, ShieldIcon, UserIcon, LockIcon, EyeIcon, EyeOffIcon, CheckIcon, XIcon, MapPinIcon } from "@/components/Icons";
import { loginAction, registerAction } from "@/lib/actions";

// Require at least one special character so accounts can't be created with
// weak, all-alphanumeric passwords.
const SPECIAL_CHAR_REGEX = /[!@#$%^&*(),.?":{}|<>_\-+=~`[\]/;']/;

const PASSWORD_RULES: { label: string; test: (password: string) => boolean }[] = [
  { label: "At least 6 characters", test: (p) => p.length >= 6 },
  { label: "At least one special character (! @ # $ % &)", test: (p) => SPECIAL_CHAR_REGEX.test(p) },
];

function getPasswordError(password: string): string | null {
  const failedRule = PASSWORD_RULES.find((rule) => !rule.test(password));
  return failedRule ? `Password must contain: ${failedRule.label.toLowerCase()}.` : null;
}

interface CampusOption {
  campus_id: number;
  campus_name: string;
}

export default function LoginForm({ campuses }: { campuses: CampusOption[] }) {
  const [isRegister, setIsRegister] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [selectedRole, setSelectedRole] = useState("Student");
  const [regPassword, setRegPassword] = useState("");
  const [regConfirmPassword, setRegConfirmPassword] = useState("");
  const [showRegPassword, setShowRegPassword] = useState(false);
  const [showRegConfirmPassword, setShowRegConfirmPassword] = useState(false);
  const [showPasswordRules, setShowPasswordRules] = useState(false);
  const [showLoginPassword, setShowLoginPassword] = useState(false);

  const handleLoginSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const res = await loginAction(null, formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  const handleRegisterSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError("");

    if (regPassword !== regConfirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    const passwordError = getPasswordError(regPassword);
    if (passwordError) {
      setError(passwordError);
      return;
    }

    setLoading(true);

    const formData = new FormData(e.currentTarget);
    const res = await registerAction(null, formData);
    if (res?.error) {
      setError(res.error);
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F7F8FA] flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-xl border border-gray-100 p-8 flex flex-col">
        {/* BRAND LOGO */}
        <div className="flex flex-col items-center text-center mb-6">
          <div className="w-12 h-12 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-md mb-2">
            <SchoolIcon size={26} />
          </div>
          <h1 className="text-xl font-extrabold text-gray-800">
            Academic<span className="text-blue-600">Hub</span>
          </h1>
          <p className="text-xs text-gray-500 mt-1">Role-Based School Management Portal</p>
        </div>

        {/* TABS: SIGN IN vs CREATE ACCOUNT */}
        <div className="flex bg-gray-100 p-1 rounded-2xl mb-6">
          <button
            type="button"
            onClick={() => {
              setIsRegister(false);
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              !isRegister ? "bg-white text-blue-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Sign In
          </button>
          <button
            type="button"
            onClick={() => {
              setIsRegister(true);
              setError("");
            }}
            className={`flex-1 py-2 text-xs font-bold rounded-xl transition ${
              isRegister ? "bg-white text-blue-700 shadow-xs" : "text-gray-500 hover:text-gray-800"
            }`}
          >
            Create Account
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-700 text-xs p-3 rounded-xl mb-4 border border-red-200">
            {error}
          </div>
        )}

        {/* SIGN IN FORM */}
        {!isRegister ? (
          <form onSubmit={handleLoginSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">
                Username or Email
              </label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <UserIcon size={16} />
                </span>
                <input
                  required
                  name="username"
                  type="text"
                  placeholder="e.g. admin or carlo.cruz@school.edu"
                  className="w-full pl-9 pr-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Password</label>
              <div className="relative">
                <span className="absolute left-3 top-2.5 text-gray-400">
                  <LockIcon size={16} />
                </span>
                <input
                  required
                  name="password"
                  type={showLoginPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  className="w-full pl-9 pr-9 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500 bg-gray-50/50"
                />
                <button
                  type="button"
                  onClick={() => setShowLoginPassword((v) => !v)}
                  className="absolute right-2.5 top-2.5 text-gray-400 hover:text-gray-600"
                  aria-label={showLoginPassword ? "Hide password" : "Show password"}
                >
                  {showLoginPassword ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? "Verifying..." : "Sign In"}
            </button>
          </form>
        ) : (
          /* CREATE ACCOUNT FORM */
          <form onSubmit={handleRegisterSubmit} className="flex flex-col gap-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">First Name</label>
                <input
                  required
                  name="first_name"
                  type="text"
                  placeholder="First name"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Last Name</label>
                <input
                  required
                  name="last_name"
                  type="text"
                  placeholder="Last name"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Username</label>
                <input
                  required
                  name="username"
                  type="text"
                  placeholder="e.g. maria.santos"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-blue-500 bg-gray-50/50"
                />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">System Role</label>
                <select
                  required
                  name="role"
                  value={selectedRole}
                  onChange={(e) => setSelectedRole(e.target.value)}
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-blue-500 bg-white"
                >
                  <option value="Student">Student</option>
                  <option value="Teacher">Teacher / Faculty</option>
                  <option value="Admin">Administrator</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Email Address</label>
              <input
                required
                name="email"
                type="email"
                placeholder="name@school.edu"
                className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-blue-500 bg-gray-50/50"
              />
            </div>

            <div className="relative">
              <label className="text-xs font-semibold text-gray-700 block mb-1">Create Password</label>
              <div className="relative">
                <input
                  required
                  name="password"
                  type={showRegPassword ? "text" : "password"}
                  value={regPassword}
                  onChange={(e) => setRegPassword(e.target.value)}
                  onFocus={() => setShowPasswordRules(true)}
                  onBlur={() => setShowPasswordRules(false)}
                  placeholder="Min. 6 characters, incl. a special character"
                  className="w-full px-3 py-2 pr-9 text-xs border border-gray-200 rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                />
                <button
                  type="button"
                  onMouseDown={(e) => e.preventDefault()}
                  onClick={() => setShowRegPassword((v) => !v)}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                  aria-label={showRegPassword ? "Hide password" : "Show password"}
                >
                  {showRegPassword ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                </button>
              </div>

              {/* LIVE PASSWORD REQUIREMENTS POPOVER */}
              {showPasswordRules && (
                <div className="absolute z-10 top-full mt-1.5 left-0 w-full bg-white border border-gray-200 rounded-xl shadow-lg p-3">
                  <p className="text-[11px] font-bold text-gray-800 mb-2 uppercase tracking-wide">
                    Password must
                  </p>
                  <ul className="flex flex-col gap-1.5">
                    {PASSWORD_RULES.map((rule) => {
                      const passed = rule.test(regPassword);
                      return (
                        <li
                          key={rule.label}
                          className={`flex items-center gap-2 text-[11px] ${
                            passed ? "text-emerald-600" : "text-gray-500"
                          }`}
                        >
                          {passed ? (
                            <CheckIcon size={13} className="text-emerald-600 shrink-0" />
                          ) : (
                            <XIcon size={13} className="text-gray-300 shrink-0" />
                          )}
                          {rule.label}
                        </li>
                      );
                    })}
                  </ul>
                </div>
              )}

              {regPassword.length > 0 && getPasswordError(regPassword) && !showPasswordRules && (
                <p className="text-[11px] text-red-600 mt-1">Invalid password</p>
              )}
            </div>

            <div>
              <label className="text-xs font-semibold text-gray-700 block mb-1">Re-enter Password</label>
              <div className="relative">
                <input
                  required
                  name="confirm_password"
                  type={showRegConfirmPassword ? "text" : "password"}
                  value={regConfirmPassword}
                  onChange={(e) => setRegConfirmPassword(e.target.value)}
                  placeholder="Re-enter your password"
                  className={`w-full px-3 py-2 pr-9 text-xs border rounded-xl outline-none bg-gray-50/50 ${
                    regConfirmPassword.length > 0 && regConfirmPassword !== regPassword
                      ? "border-red-300 focus:border-red-400"
                      : "border-gray-200 focus:border-purple-500"
                  }`}
                />
                <button
                  type="button"
                  onClick={() => setShowRegConfirmPassword((v) => !v)}
                  className="absolute right-2.5 top-2 text-gray-400 hover:text-gray-600"
                  aria-label={showRegConfirmPassword ? "Hide password" : "Show password"}
                >
                  {showRegConfirmPassword ? <EyeOffIcon size={15} /> : <EyeIcon size={15} />}
                </button>
              </div>
              {regConfirmPassword.length > 0 && (
                regConfirmPassword === regPassword ? (
                  <p className="text-[11px] text-emerald-600 mt-1 flex items-center gap-1">
                    <CheckIcon size={12} /> Passwords match
                  </p>
                ) : (
                  <p className="text-[11px] text-red-600 mt-1">Invalid password — does not match</p>
                )
              )}
            </div>

            {/* CAMPUS — only Students and Teachers belong to a campus */}
            {(selectedRole === "Student" || selectedRole === "Teacher") && (
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Campus</label>
                <div className="relative">
                  <span className="absolute left-3 top-2.5 text-gray-400 pointer-events-none">
                    <MapPinIcon size={14} />
                  </span>
                  <select
                    name="campus_id"
                    defaultValue={campuses[0]?.campus_id ?? ""}
                    className="w-full pl-8 pr-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-purple-500 bg-white appearance-none cursor-pointer hover:border-purple-300 transition"
                  >
                    {campuses.length === 0 && <option value="">No campuses available</option>}
                    {campuses.map((c) => (
                      <option key={c.campus_id} value={c.campus_id}>
                        {c.campus_name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            )}

            {/* CONDITIONAL PROFILE FIELDS */}
            {selectedRole === "Student" && (
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Year Level</label>
                  <select
                    name="year_level"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="1st Year">1st Year</option>
                    <option value="2nd Year">2nd Year</option>
                    <option value="3rd Year">3rd Year</option>
                    <option value="4th Year">4th Year</option>
                  </select>
                </div>
                <div>
                  <label className="text-xs font-semibold text-gray-700 block mb-1">Sex</label>
                  <select
                    name="sex"
                    className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-purple-500 bg-white"
                  >
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                  </select>
                </div>
              </div>
            )}

            {selectedRole === "Teacher" && (
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Contact Number</label>
                <input
                  name="contact_number"
                  placeholder="+63 917 000 0000"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                />
              </div>
            )}

            {selectedRole === "Admin" && (
              <div>
                <label className="text-xs font-semibold text-gray-700 block mb-1">Department</label>
                <input
                  name="department"
                  placeholder="e.g. Academic Affairs"
                  className="w-full px-3 py-2 text-xs border border-gray-200 rounded-xl outline-none focus:border-purple-500 bg-gray-50/50"
                />
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full mt-2 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-md transition disabled:opacity-50"
            >
              {loading ? "Creating Account..." : "Register & Sign In"}
            </button>
          </form>
        )}

        {/* DEFAULT DEMO CREDENTIALS HELPER */}
        <div className="mt-6 pt-4 border-t border-gray-100 text-center">
          <p className="text-[11px] font-semibold text-gray-400 mb-1">
            SEEDED DEMO CREDENTIALS (PASSWORD: password123)
          </p>
          <div className="flex flex-wrap justify-center gap-2 text-[10px] text-gray-600">
            <span className="bg-blue-50 text-blue-700 px-2 py-1 rounded-md font-mono">
              admin
            </span>
            <span className="bg-amber-50 text-amber-700 px-2 py-1 rounded-md font-mono">
              teacher.reyes
            </span>
            <span className="bg-sky-50 text-sky-700 px-2 py-1 rounded-md font-mono">
              student.cruz
            </span>
          </div>
        </div>

        <div className="mt-4 text-center">
          <span className="text-[10px] text-gray-400 flex items-center justify-center gap-1">
            <ShieldIcon size={12} className="text-gray-400" />
            Connected to PostgreSQL 18
          </span>
        </div>
      </div>
    </div>
  );
}
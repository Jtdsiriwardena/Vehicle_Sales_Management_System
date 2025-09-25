import { useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../api/axios";
import { AxiosError } from "axios";



const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //Login
  const handleLogin = async () => {
    if (!username || !password) {
      alert("Please fill in all fields");
      return;
    }

    setIsLoading(true);
    try {
      const res = await API.post("/auth/login", { username, password });
      localStorage.setItem("token", res.data.token);
      navigate("/dashboard");
    } catch (err) {
      const error = err as AxiosError<{ message: string }>;
      alert(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLogin();
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8 bg-white/10 backdrop-blur-lg rounded-2xl shadow-2xl p-8 border border-white/20">

        {/* Header */}
        <div className="text-center">
          <div className="mx-auto h-16 w-16 bg-gradient-to-r from-blue-500 to-cyan-400 rounded-2xl flex items-center justify-center shadow-lg mb-4">
            <span className="text-white font-bold text-xl">CX</span>

          </div>
          <h2 className="text-3xl font-bold text-white mb-2">CarvanaX Admin Portal</h2>
          <p className="text-blue-200/80 text-sm">Admin Portal Access</p>
        </div>

        {/* Login Form */}
        <div className="space-y-6 mt-8">
          <div className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-blue-100 mb-2">
                Username
              </label>
              <input
                id="username"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                placeholder="Enter your username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-blue-100 mb-2">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="w-full px-4 py-3 bg-white/5 border border-white/20 rounded-xl text-white placeholder-blue-200/50 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all duration-200"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onKeyPress={handleKeyPress}
              />
            </div>
          </div>

          <button
            onClick={handleLogin}
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-blue-500 to-cyan-500 hover:from-blue-600 hover:to-cyan-600 disabled:from-blue-400 disabled:to-cyan-400 text-white font-semibold py-3 px-4 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 disabled:transform-none disabled:hover:shadow-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-slate-900"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Signing in...
              </div>
            ) : (
              "Sign In"
            )}
          </button>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-blue-200/50 text-xs">
            © 2025 CarvanaX (PVT) LTD. All rights reserved.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
import { Link, useLocation, useNavigate } from "react-router-dom";


const Sidebar = () => {
  const location = useLocation();
  const navigate = useNavigate();

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem("token"); // remove JWT
    navigate("/"); // redirect to login
  };

  const menuItems = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2H5a2 2 0 00-2-2z" />
        </svg>
      )
    },
    {
      name: "Add Vehicle",
      path: "/vehicles/create",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    },
    {
      name: "Analytics",
      path: "/analytics",
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
      )
    }
  ];

  return (
    <div className="h-screen w-64 bg-gradient-to-b from-slate-900 to-blue-900 text-white flex flex-col border-r border-white/10 fixed">

      {/* Header */}
      <div className="flex items-center justify-center p-6 border-b border-white/10">
        <span className="text-xl font-bold bg-gradient-to-r text-white bg-clip-text ">
          CarvanaX Admin
        </span>
      </div>


      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
        {menuItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center rounded-xl p-3 transition-all duration-200 group hover:bg-white/10 hover:translate-x-1 ${location.pathname === item.path
              ? "bg-gradient-to-r from-blue-500/20 to-cyan-500/20 border-l-4 border-cyan-400 shadow-lg"
              : "border-l-4 border-transparent"
              }`}
          >
            <div
              className={`${location.pathname === item.path ? "text-cyan-400" : "text-blue-200"
                } group-hover:text-cyan-300 transition-colors duration-200`}
            >
              {item.icon}
            </div>
            <span
              className={`ml-3 font-medium ${location.pathname === item.path ? "text-cyan-100" : "text-blue-100"
                } group-hover:text-white transition-colors duration-200`}
            >
              {item.name}
            </span>
          </Link>
        ))}
      </nav>


      {/* User Profile */}
      <div className="p-4 border-t border-white/10">
        {/* Profile Card */}
        <div className="flex items-center space-x-3 p-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center">
            <span className="text-sm font-bold">A</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">Admin User</p>
            <p className="text-xs text-blue-300/70 truncate">admin@carvana.com</p>
          </div>
        </div>

        {/* Logout Card*/}
        <div
          onClick={handleLogout}
          className="flex items-center space-x-3 p-3 mt-3 rounded-xl bg-white/5 hover:bg-white/10 transition-all duration-200 cursor-pointer"
        >
          <div className="w-8 h-8 bg-red-500 rounded-full flex items-center justify-center">
            <svg
              className="w-5 h-5 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a2 2 0 01-2 2H5a2 2 0 01-2-2V7a2 2 0 012-2h6a2 2 0 012 2v1"
              />
            </svg>
          </div>
          <span className="text-sm text-white font-medium">Logout</span>
        </div>
      </div>


    </div>
  );
};

export default Sidebar;


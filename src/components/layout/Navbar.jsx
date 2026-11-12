import { useAuth } from "../../context/AuthContext";
import Badge from "../common/Badge";
import { FaUserCircle, FaSignOutAlt, FaLeaf } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const roleBadge = (role) => {
    switch (role) {
      case "admin":
        return <Badge variant="danger">ADMIN</Badge>;
      case "doctor":
        return <Badge variant="info">DOCTOR</Badge>;
      case "therapist":
        return <Badge variant="success">THERAPIST</Badge>;
      default:
        return <Badge variant="default">STAFF</Badge>;
    }
  };

  return (
    <header className="h-16 bg-white border-b border-slate-200 px-6 flex justify-between items-center sticky top-0 z-20">
      <div className="flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-emerald-600 flex items-center justify-center text-white text-sm shadow-sm">
          <FaLeaf />
        </div>
        <h1 className="text-lg font-bold text-slate-800">
          Panchveda Portal
        </h1>
      </div>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3 border-r border-slate-200 pr-4">
          <div className="w-9 h-9 rounded-full bg-emerald-700 text-white flex items-center justify-center font-bold text-sm shadow-sm">
            {user?.fullName?.charAt(0)?.toUpperCase() || <FaUserCircle />}
          </div>
          <div className="hidden sm:block text-right">
            <p className="text-sm font-semibold text-slate-900 leading-tight">
              {user?.fullName || "Staff Member"}
            </p>
            <div className="mt-0.5">{roleBadge(user?.role)}</div>
          </div>
        </div>

        <button
          onClick={handleLogout}
          title="Sign out"
          className="flex items-center gap-2 text-sm text-slate-600 hover:text-red-600 p-2 rounded-lg hover:bg-red-50 transition"
        >
          <FaSignOutAlt />
          <span className="hidden md:inline">Logout</span>
        </button>
      </div>
    </header>
  );
};

export default Navbar;

import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import {
  FaTachometerAlt,
  FaUsers,
  FaHeartbeat,
  FaClipboardList,
  FaCalendarCheck,
  FaMoneyBillWave,
  FaChartBar,
  FaUserShield,
  FaSignOutAlt,
  FaLeaf,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaTachometerAlt />,
    roles: ["admin", "doctor", "therapist"],
  },
  {
    name: "Patients",
    path: "/patients",
    icon: <FaUsers />,
    roles: ["admin", "doctor", "therapist"],
  },
  {
    name: "Therapies",
    path: "/therapies",
    icon: <FaHeartbeat />,
    roles: ["admin", "doctor", "therapist"],
  },
  {
    name: "Therapy Plans",
    path: "/plans",
    icon: <FaClipboardList />,
    roles: ["admin", "doctor", "therapist"],
  },
  {
    name: "Sessions",
    path: "/sessions",
    icon: <FaCalendarCheck />,
    roles: ["admin", "doctor", "therapist"],
  },
  {
    name: "Billing",
    path: "/bills",
    icon: <FaMoneyBillWave />,
    roles: ["admin", "doctor"],
  },
  {
    name: "Reports",
    path: "/reports",
    icon: <FaChartBar />,
    roles: ["admin", "doctor"],
  },
  {
    name: "Staff Users",
    path: "/users",
    icon: <FaUserShield />,
    roles: ["admin"],
  },
];

const Sidebar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const allowedMenus = menuItems.filter((item) =>
    item.roles.includes(user?.role)
  );

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  return (
    <aside className="w-64 min-h-screen bg-slate-900 text-white flex flex-col shrink-0">
      <div className="p-6 border-b border-slate-800 flex items-center gap-3">
        <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center text-white text-xl shadow-lg">
          <FaLeaf />
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white leading-none">
            Panchveda
          </h2>
          <span className="text-xs text-emerald-400 font-medium">
            Ayurvedic Care Portal
          </span>
        </div>
      </div>

      <nav className="flex-1 p-4 overflow-y-auto">
        <div className="text-xs font-semibold uppercase tracking-wider text-slate-400 px-4 mb-2">
          Menu
        </div>
        <ul className="space-y-1.5">
          {allowedMenus.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                    isActive
                      ? "bg-emerald-600 text-white shadow-md shadow-emerald-900/50"
                      : "text-slate-300 hover:bg-slate-800 hover:text-white"
                  }`
                }
              >
                <span className="text-lg">{item.icon}</span>
                <span>{item.name}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="p-4 border-t border-slate-800">
        <div className="px-3 py-2 mb-2 text-xs text-slate-400 flex items-center justify-between">
          <span>Signed in as:</span>
          <span className="font-semibold text-slate-200 capitalize">
            {user?.role || "Staff"}
          </span>
        </div>
        <button
          onClick={handleLogout}
          className="w-full flex items-center justify-center gap-2 bg-slate-800 hover:bg-red-700 text-white py-2.5 rounded-xl font-medium text-sm transition"
        >
          <FaSignOutAlt />
          Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;

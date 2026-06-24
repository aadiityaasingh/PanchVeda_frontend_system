import { NavLink } from "react-router-dom";

import {
  FaTachometerAlt,
  FaUsers,
  FaHeartbeat,
  FaClipboardList,
  FaCalendarCheck,
  FaMoneyBillWave,
} from "react-icons/fa";

const menuItems = [
  {
    name: "Dashboard",
    path: "/dashboard",
    icon: <FaTachometerAlt />,
  },
  {
    name: "Patients",
    path: "/patients",
    icon: <FaUsers />,
  },
  {
    name: "Therapies",
    path: "/therapies",
    icon: <FaHeartbeat />,
  },
  {
    name: "Therapy Plans",
    path: "/plans",
    icon: <FaClipboardList />,
  },
  {
    name: "Sessions",
    path: "/sessions",
    icon: <FaCalendarCheck />,
  },
  {
    name: "Bills",
    path: "/bills",
    icon: <FaMoneyBillWave />,
  },
];

const Sidebar = () => {
  return (
    <div className="w-64 min-h-screen bg-slate-900 text-white flex flex-col">
      
      <div className="p-6 border-b border-slate-700">
        <h1 className="text-2xl font-bold">
          Panchakarma
        </h1>
      </div>

      <div className="flex-1 p-4">
        <ul className="space-y-2">
          {menuItems.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                className={({ isActive }) =>
                  `flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                    isActive
                      ? "bg-blue-600 text-white"
                      : "hover:bg-slate-800"
                  }`
                }
              >
                {item.icon}
                {item.name}
              </NavLink>
            </li>
          ))}
        </ul>
      </div>

      <div className="p-4 border-t border-slate-700">
        <button
          className="w-full bg-red-500 hover:bg-red-600 py-2 rounded-lg"
        >
          Logout
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
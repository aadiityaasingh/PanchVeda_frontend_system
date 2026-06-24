import { useAuth } from "../../context/AuthContext";

const Navbar = () => {
  const { user } = useAuth();

  return (
    <div className="h-16 bg-white shadow px-6 flex justify-between items-center">
      <h2 className="text-xl font-semibold">
        Dashboard
      </h2>

      <div>
        <p className="font-medium">
          {user?.fullName || "Guest"}
        </p>

        <p className="text-sm text-gray-500">
          {user?.role || ""}
        </p>
      </div>
    </div>
  );
};

export default Navbar;
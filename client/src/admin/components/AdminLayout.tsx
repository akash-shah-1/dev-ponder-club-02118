import { Outlet, Link, useNavigate } from "react-router-dom";

export default function AdminLayout() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('admin_access_token');
    navigate("/admin/login");
  };

  return (
    <div className="flex h-screen bg-gray-100">
      <aside className="w-64 bg-gray-800 text-white p-4 flex flex-col">
        <h2 className="text-2xl font-bold mb-6">Admin Panel</h2>
        <nav className="flex-1">
          <ul>
            <li className="mb-2">
              <Link to="/admin/dashboard" className="block hover:text-blue-300">Dashboard</Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/chatbot" className="block hover:text-blue-300">Chatbot</Link>
            </li>
            <li className="mb-2">
              <Link to="/admin/reports" className="block hover:text-blue-300">Reports</Link>
            </li>
          </ul>
        </nav>
        <button
          onClick={handleLogout}
          className="mt-4 px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
        >
          Logout
        </button>
      </aside>
      <main className="flex-1 p-6 overflow-auto">
        <Outlet />
      </main>
    </div>
  );
}
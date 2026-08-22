import { Link } from "react-router-dom";

function Unauthorized() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-6">
      <div className="text-center max-w-md bg-white border rounded-xl p-10 shadow-sm">

        <div className="text-5xl mb-4">🚫</div>

        <h1 className="text-3xl font-bold text-gray-800 mb-2">
          403 - Access Denied
        </h1>

        <p className="text-gray-500 mb-6">
          You don’t have permission to view this page.
        </p>

        <div className="flex gap-3 justify-center">
          <Link
            to="/"
            className="px-5 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700 transition"
          >
            Go Home
          </Link>

          <Link
            to="/login"
            className="px-5 py-2 rounded-lg border border-gray-300 text-gray-700 hover:bg-gray-100 transition"
          >
            Login
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Unauthorized;
import Form from "./Form";
export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">pokertracker</h1>
            <p className="text-gray-300">Track your home games for free</p>
          </div>

          <Form />
          <div className="mt-6 text-center">
            <a
              href="#"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Forgot your password?
            </a>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            <p className="text-sm text-gray-400">
              Don't have an account?{" "}
              <a
                href="#"
                className="text-blue-400 hover:text-blue-300 font-medium transition-colors"
              >
                Sign up
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

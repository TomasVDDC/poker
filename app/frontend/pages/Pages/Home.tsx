import { Button } from "@/components/ui/button";
import Form from "./Form";
import { Link } from "@inertiajs/react";
import { useState } from "react";
import { set } from "date-fns";
export default function Home() {
  const [hasAnAccount, setHasAnAccount] = useState<boolean>(false);
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-800 via-gray-700 to-blue-800 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 border border-white/20">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-white mb-2">pokertracker</h1>
            <p className="text-gray-300">Track your home games for free</p>
          </div>

          <Form
            onSubmit={
              hasAnAccount
                ? (form) => {
                    form.transform((data) => ({
                      email_address: data.email_address,
                      password: data.password,
                    }));
                    form.post("/session");
                  }
                : (form) => {
                    form.transform((data) => ({ user: data }));
                    form.post("/users");
                  }
            }
            submitText={hasAnAccount ? "Sign In" : "Sign up"}
          />

          <div className="mt-6 text-center">
            <Link
              href="#"
              className="text-sm text-gray-300 hover:text-white transition-colors"
            >
              Forgot your password?
            </Link>
          </div>

          <div className="mt-8 pt-6 border-t border-white/10 text-center">
            {hasAnAccount ? (
              <p className="text-sm text-gray-400">
                Don't have an account?{" "}
                <div
                  onClick={() => setHasAnAccount(false)}
                  className="text-blue-400 cursor-pointer hover:text-blue-300 font-medium transition-colors"
                >
                  Sign up
                </div>
              </p>
            ) : (
              <p className="text-sm text-gray-400">
                Already have an account?{" "}
                <div
                  onClick={() => setHasAnAccount(true)}
                  className="text-blue-400  cursor-pointer hover:text-blue-300 font-medium transition-colors"
                >
                  Sign in
                </div>
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

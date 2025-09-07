import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";

// Temporary fix for InertiaFormProps not being exported from @inertiajs/react
type InertiaFormProps<TForm extends Record<string, any>> = ReturnType<
  typeof useForm<TForm>
>;

interface UserType {
  id: number;
  email_address: string;
  password: string;
}

type UserFormType = Omit<UserType, "id">;

interface FormProps {
  onSubmit: (form: InertiaFormProps<UserFormType>) => void;
  submitText: string;
}
export default function Form({ onSubmit, submitText }: FormProps) {
  const form = useForm<UserFormType>();
  const { data, setData, errors, processing } = form;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };
  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <input
          type="email"
          placeholder="Email address"
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          onChange={(e) => setData("email_address", e.target.value)}
        />
      </div>

      <div>
        <input
          type="password"
          placeholder="Password"
          className="w-full px-4 py-3 rounded-lg bg-white/10 border border-white/20 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:border-transparent transition-all"
          onChange={(e) => setData("password", e.target.value)}
        />
      </div>

      <button
        type="submit"
        className="w-full py-3 px-4 bg-gradient-to-r from-slate-600 to-blue-600 text-white font-semibold rounded-lg hover:from-slate-700 hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-2 focus:ring-offset-transparent transition-all transform hover:scale-[1.02]"
      >
        Sign In
      </button>
    </form>
  );
}

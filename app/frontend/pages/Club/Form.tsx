import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { ClubFormType, ClubType } from "./types";

// List of currency options (ISO 4217 codes)
const currencyOptions = [
  { value: "$", label: "USD - US Dollar ($)" },
  { value: "€", label: "EUR - Euro (€)" },
  { value: "£", label: "GBP - British Pound (£)" },
  { value: "Fr", label: "CHF - Swiss Franc (Fr)" },
  { value: "$", label: "CAD - Canadian Dollar ($)" },
  { value: "$", label: "AUD - Australian Dollar ($)" },
  { value: "¥", label: "JPY - Japanese Yen (¥)" },
];

// Temporary fix for InertiaFormProps not being exported from @inertiajs/react
type InertiaFormProps<TForm extends Record<string, any>> = ReturnType<
  typeof useForm<TForm>
>;

interface FormProps {
  club: ClubType;
  onSubmit: (form: InertiaFormProps<ClubFormType>) => void;
  submitText: string;
}

export default function Form({ club, onSubmit, submitText }: FormProps) {
  const form = useForm<ClubFormType>({
    name: club.name,
    currency: club.currency,
  });
  const { data, setData, errors, processing } = form;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="contents">
      <div className="my-5">
        <label htmlFor="name">Name</label>
        <input
          type="text"
          name="name"
          id="name"
          value={data.name}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData("name", e.target.value)}
        />
        {errors.name && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.name}
          </div>
        )}

        <label htmlFor="currency">Currency</label>
        <select
          name="currency"
          id="currency"
          value={data.currency}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData("currency", e.target.value)}
        >
          {currencyOptions.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
        {errors.currency && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.currency}
          </div>
        )}
      </div>

      <div className="inline">
        <button
          type="submit"
          disabled={processing}
          className="rounded-lg py-3 px-5 bg-blue-600 text-white inline-block font-medium cursor-pointer"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}

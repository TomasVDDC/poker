import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { PlayerSessionFormType, PlayerSessionType } from "./types";

// Temporary fix for InertiaFormProps not being exported from @inertiajs/react
type InertiaFormProps<TForm extends Record<string, any>> = ReturnType<
  typeof useForm<TForm>
>;

interface FormProps {
  player_session: PlayerSessionType;
  onSubmit: (form: InertiaFormProps<PlayerSessionFormType>) => void;
  submitText: string;
}

export default function Form({
  player_session,
  onSubmit,
  submitText,
}: FormProps) {
  const form = useForm<PlayerSessionFormType>({
    number_of_buy_ins: player_session.number_of_buy_ins,
    winnings: player_session.winnings,
  });
  const { data, setData, errors, processing } = form;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="contents">
      <div className="my-5">
        <label htmlFor="number_of_buy_in">Number of buy ins</label>
        <input
          type="number"
          name="number_of_buy_in"
          id="number_of_buy_in"
          value={data.number_of_buy_ins}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) =>
            setData("number_of_buy_ins", parseInt(e.target.value))
          }
        />
        {errors.number_of_buy_ins && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.number_of_buy_ins}
          </div>
        )}
      </div>
      <div className="my-5">
        <label htmlFor="winning">Winnings</label>
        <input
          type="number"
          name="winning"
          id="winning"
          value={data.winnings}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData("winnings", parseFloat(e.target.value))}
        />
        {errors.winnings && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.winnings}
          </div>
        )}
      </div>

      <div className="inline">
        <button
          type="submit"
          disabled={processing}
          className="rounded-lg py-3 px-5 bg-blue-600 text-white inline-block  text-sm sm:text-base cursor-pointer"
        >
          {submitText}
        </button>
      </div>
    </form>
  );
}

import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { PlayerSessionFormType, PlayerSessionType } from "./types";
import { Button } from "@/components/ui/button";

// Temporary fix for InertiaFormProps not being exported from @inertiajs/react
type InertiaFormProps<TForm extends Record<string, any>> = ReturnType<
  typeof useForm<TForm>
>;

interface FormProps {
  player_session: PlayerSessionType;
  // The game's standard buy in, used by the quick top up button.
  buy_in: number;
  currency: string;
  onSubmit: (form: InertiaFormProps<PlayerSessionFormType>) => void;
  submitText: string;
}

export default function Form({
  player_session,
  buy_in,
  currency,
  onSubmit,
  submitText,
}: FormProps) {
  const form = useForm<PlayerSessionFormType>({
    amount_in: player_session.amount_in,
    amount_out: player_session.amount_out,
  });
  const { data, setData, errors, processing } = form;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  // Keep the running total to 2dp so repeated top ups can't drift.
  const addBuyIn = () =>
    setData(
      "amount_in",
      Math.round(((data.amount_in || 0) + buy_in) * 100) / 100,
    );

  return (
    <form onSubmit={handleSubmit} className="contents">
      <div className="my-5">
        <label htmlFor="amount_in">Total bought in for</label>
        <div className="flex gap-2 mt-2">
          <input
            type="number"
            step="0.01"
            name="amount_in"
            id="amount_in"
            value={data.amount_in}
            className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 w-full"
            onChange={(e) => setData("amount_in", parseFloat(e.target.value))}
          />
          {buy_in > 0 && (
            <Button
              type="button"
              variant="secondary"
              className="shrink-0 cursor-pointer"
              onClick={addBuyIn}
            >
              {`+ ${currency}${buy_in}`}
            </Button>
          )}
        </div>
        <p className="text-sm text-gray-500 mt-1">
          Rebuys included — any amount, not just whole buy ins.
        </p>
        {errors.amount_in && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.amount_in}
          </div>
        )}
      </div>
      <div className="my-5">
        <label htmlFor="amount_out">Cashed out for</label>
        <input
          type="number"
          step="0.01"
          name="amount_out"
          id="amount_out"
          value={data.amount_out}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData("amount_out", parseFloat(e.target.value))}
        />
        {errors.amount_out && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.amount_out}
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

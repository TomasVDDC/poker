import { useForm } from "@inertiajs/react";
import { FormEvent } from "react";
import { format } from "date-fns";
import { GameFormType, GameType } from "./types";
import {
  MiniCalendar,
  MiniCalendarDay,
  MiniCalendarDays,
  MiniCalendarNavigation,
} from "@/components/ui/mini-calendar";
// Temporary fix for InertiaFormProps not being exported from @inertiajs/react
type InertiaFormProps<TForm extends Record<string, any>> = ReturnType<
  typeof useForm<TForm>
>;

interface FormProps {
  game: GameType;
  onSubmit: (form: InertiaFormProps<GameFormType>) => void;
  submitText: string;
}

export default function Form({ game, onSubmit, submitText }: FormProps) {
  const form = useForm<GameFormType>({
    buy_in: game.buy_in,
    date: game.date,
  });
  const { data, setData, errors, processing } = form;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="contents">
      <div className="my-5">
        <label htmlFor="buy_in">Buy in</label>
        <input
          type="number"
          name="buy_in"
          id="buy_in"
          value={data.buy_in}
          className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
          onChange={(e) => setData("buy_in", parseInt(e.target.value))}
        />
        {errors.buy_in && (
          <div className="text-red-500 px-3 py-2 font-medium">
            {errors.buy_in}
          </div>
        )}
        <label htmlFor="date">Date</label>
        <MiniCalendar
          onValueChange={(e) => {
            console.log("helloe", e?.toDateString());
            setData("date", format(e, "PPP"));
          }}
        >
          <MiniCalendarNavigation direction="prev" />
          <MiniCalendarDays>
            {(date) => <MiniCalendarDay date={date} key={date.toISOString()} />}
          </MiniCalendarDays>
          <MiniCalendarNavigation direction="next" />
        </MiniCalendar>
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

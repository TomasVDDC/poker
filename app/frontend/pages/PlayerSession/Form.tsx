import { useForm } from "@inertiajs/react";

interface PlayerSessionFormProps {
  player_name?: string;
  number_of_buy_ins?: number;
  winnings?: number;
  action: string; // URL to submit to
}

export default function PlayerSessionForm({
  player_name = "",
  number_of_buy_ins = 0,
  winnings = 0,
  action,
}: PlayerSessionFormProps) {
  const { data, setData, post, transform, errors, processing } = useForm({
    player_name,
    number_of_buy_ins,
    winnings,
  });

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        transform((data) => ({ player_session: data }));
        post("/player_sessions");
      }}
    >
      <div>
        <label>Player Name</label>
        <input
          type="text"
          value={data.player_name}
          onChange={(e) => setData("player_name", e.target.value)}
        />
        {errors.player_name && (
          <span className="error">{errors.player_name}</span>
        )}
      </div>

      <div>
        <label>Number of buy ins</label>
        <input
          type="number"
          value={data.number_of_buy_ins}
          onChange={(e) =>
            setData("number_of_buy_ins", parseInt(e.target.value) || 0)
          }
        />
        {errors.number_of_buy_ins && (
          <span className="error">{errors.number_of_buy_ins}</span>
        )}
      </div>

      <div>
        <label>Winnings</label>
        <input
          type="number"
          value={data.winnings}
          onChange={(e) => setData("winnings", parseInt(e.target.value) || 0)}
        />
        {errors.winnings && <span className="error">{errors.winnings}</span>}
      </div>

      <button type="submit" disabled={processing}>
        {processing ? "Saving..." : "Save"}
      </button>
    </form>
  );
}
// import { useForm } from "@inertiajs/react";
// import { FormEvent } from "react";
// import { PlayerSessionFormType, PlayerSessionType } from "./types";

// // Temporary fix for InertiaFormProps not being exported from @inertiajs/react
// type InertiaFormProps<TForm extends Record<string, any>> = ReturnType<
//   typeof useForm<TForm>
// >;

// interface FormProps {
//   player_name: string;
//   player_session: PlayerSessionType;
//   onSubmit: (form: InertiaFormProps<PlayerSessionFormType>) => void;
//   submitText: string;
// }

// export default function Form({
//   player_name,
//   player_session,
//   onSubmit,
//   submitText,
// }: FormProps) {
//   const form = useForm<PlayerSessionFormType>({
//     number_of_buy_ins: player_session.number_of_buy_ins,
//     winnings: player_session.winnings,
//   });
//   const { data, setData, errors, processing } = form;

//   const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
//     e.preventDefault();
//     onSubmit(form);
//   };

//   return (
//     <form onSubmit={handleSubmit} className="contents">
//       <div className="my-5">
//         <label htmlFor="player_name">Player</label>
//         <input
//           type="string"
//           name="player_name"
//           id="player_name"
//           value={data.player_name}
//           className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
//           onChange={(e) =>
//             setData("player_name", parseInt(e.target.value))
//           }
//         />
//         {errors.number_of_buy_ins && (
//           <div className="text-red-500 px-3 py-2 font-medium">
//             {errors.number_of_buy_ins}
//           </div>
//         )}
//       </div>

//       <div className="my-5">
//         <label htmlFor="number_of_buy_in">Number of buy ins</label>
//         <input
//           type="number"
//           name="number_of_buy_in"
//           id="number_of_buy_in"
//           value={data.number_of_buy_ins}
//           className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
//           onChange={(e) =>
//             setData("number_of_buy_ins", parseInt(e.target.value))
//           }
//         />
//         {errors.number_of_buy_ins && (
//           <div className="text-red-500 px-3 py-2 font-medium">
//             {errors.number_of_buy_ins}
//           </div>
//         )}
//       </div>
//       <div className="my-5">
//         <label htmlFor="winning">Winnings</label>
//         <input
//           type="number"
//           name="winning"
//           id="winning"
//           value={data.winnings}
//           className="block shadow rounded-md border border-gray-400 outline-none px-3 py-2 mt-2 w-full"
//           onChange={(e) => setData("winnings", parseInt(e.target.value))}
//         />
//         {errors.winnings && (
//           <div className="text-red-500 px-3 py-2 font-medium">
//             {errors.winnings}
//           </div>
//         )}
//       </div>

//       <div className="inline">
//         <button
//           type="submit"
//           disabled={processing}
//           className="rounded-lg py-3 px-5 bg-blue-600 text-white inline-block font-medium cursor-pointer"
//         >
//           {submitText}
//         </button>
//       </div>
//     </form>
//   );
// }

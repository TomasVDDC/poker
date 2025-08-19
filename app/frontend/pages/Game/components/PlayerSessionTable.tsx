// The game table component is the combination of the shadcn table component and tanstack react table
import { PlayerSessionListItemType } from "@/pages/PlayerSession/types";
// react-table
import {
  ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
} from "@tanstack/react-table";
// shadcn implementation of a table component
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
// For row actions
import { MoreHorizontal } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { router } from "@inertiajs/react";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  isReadOnly?: boolean;
}

function DataTable<TData, TValue>({
  columns,
  data,
  isReadOnly,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    meta: { isReadOnly },
  });

  return (
    <div className="overflow-hidden rounded-md border">
      <Table>
        <TableHeader>
          {table.getHeaderGroups().map((headerGroup) => (
            <TableRow key={headerGroup.id}>
              {headerGroup.headers.map((header) => {
                return (
                  <TableHead key={header.id}>
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext(),
                        )}
                  </TableHead>
                );
              })}
            </TableRow>
          ))}
        </TableHeader>
        <TableBody>
          {table.getRowModel().rows?.length ? (
            table.getRowModel().rows.map((row) => {
              const player_session = row.original;
              return (
                <TableRow
                  className="cursor-pointer hover:cursor-default"
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext(),
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              );
            })
          ) : (
            <TableRow>
              <TableCell colSpan={columns.length} className="h-24 text-center">
                No results.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
// Initialising our instance of the datable, with our game specific type and value

export const ColumnHeaders: ColumnDef<PlayerSessionListItemType>[] = [
  {
    accessorKey: "player_name",
    header: () => <div className="sm:text-xl text-right"> Name </div>,
    cell: ({ row }) => {
      return <div className="text-right">{row.getValue("player_name")}</div>;
    },
  },
  {
    accessorKey: "formatted_winnings",
    header: () => <div className="sm:text-xl text-right"> Winnings </div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">{row.getValue("formatted_winnings")}</div>
      );
    },
  },
  {
    accessorKey: "number_of_buy_ins",
    header: () => <div className="sm:text-xl text-right"> Buy Ins </div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">{row.getValue("number_of_buy_ins")}</div>
      );
    },
  },
  {
    accessorKey: "net_profit_or_loss",
    header: () => <div className="sm:text-xl text-right"> Net Profit</div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">{row.getValue("net_profit_or_loss")}</div>
      );
    },
  },
  {
    id: "actions",
    cell: ({ row, table }) => {
      const player_session = row.original;

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" onClick={(e) => e.stopPropagation()}>
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() =>
                router.visit(
                  `/clubs/${player_session.club_id}/games/${player_session.game_id}/player_sessions/${player_session.id}/edit`,
                )
              }
              disabled={table.options.meta?.isReadOnly}
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.delete(
                  `/clubs/${player_session.club_id}/games/${player_session.game_id}/player_sessions/${player_session.id}/`,
                )
              }
              disabled={table.options.meta?.isReadOnly}
            >
              Delete
            </DropdownMenuItem>
            {/* <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem> */}
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export function PlayerSessionTable(props: {
  player_sessions: PlayerSessionListItemType[];
  isReadOnly?: boolean;
}) {
  return (
    <div className="">
      <DataTable
        columns={ColumnHeaders}
        data={props.player_sessions}
        isReadOnly={props.isReadOnly}
      />
    </div>
  );
}

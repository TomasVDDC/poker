// The game table component is the combination of the shadcn table component and tanstack react table
import { GameListItemType } from "@/pages/Game/types";
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
}

function DataTable<TData, TValue>({
  columns,
  data,
}: DataTableProps<TData, TValue>) {
  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
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
              const game = row.original;
              return (
                <TableRow
                  className="cursor-pointer"
                  onClick={() => {
                    router.visit(`/clubs/${game.club_id}/games/${game.id}/`);
                  }}
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

export const ColumnHeaders: ColumnDef<GameListItemType>[] = [
  {
    accessorKey: "formatted_created_at",
    header: () => <div className="text-xl text-right"> Date </div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">{row.getValue("formatted_created_at")}</div>
      );
    },
  },
  {
    accessorKey: "formatted_buy_in",
    header: () => <div className="text-xl text-right"> Buy In </div>,
    cell: ({ row }) => {
      return (
        <div className="text-right">{row.getValue("formatted_buy_in")}</div>
      );
    },
  },
  {
    accessorKey: "pot",
    header: () => <div className="text-xl text-right"> Pot </div>,
    cell: ({ row }) => {
      return <div className="text-right">{row.getValue("pot")}</div>;
    },
  },
  {
    id: "actions",
    cell: ({ row }) => {
      const game = row.original;

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
                router.visit(`/clubs/${game.club_id}/games/${game.id}/edit`)
              }
            >
              Edit
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.delete(`/clubs/${game.club_id}/games/${game.id}`)
              }
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

export function GameTable(props: { games: GameListItemType[] }) {
  return (
    <div className="">
      <DataTable columns={ColumnHeaders} data={props.games} />
    </div>
  );
}

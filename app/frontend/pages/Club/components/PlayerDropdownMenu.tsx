import { PlayerType } from "@/pages/Player/types";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { MoreHorizontal } from "lucide-react";

import { router } from "@inertiajs/react";

export function PlayerDropdownMenu({ player }: { player: PlayerType }) {
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
            router.visit(`/clubs/${player.club_id}/players/${player.id}/edit`)
          }
        >
          Edit
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() =>
            router.delete(`/clubs/${player.club_id}/players/${player.id}`)
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
}

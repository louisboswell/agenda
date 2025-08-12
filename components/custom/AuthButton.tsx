"use client";

import { signIn, signOut, useSession } from "next-auth/react";
import { Button } from "../ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { ModeToggle } from "./ModeToggle";

export default function AuthButton() {
	const { data: session } = useSession();

	return (
		<div className="w-[200px] flex flex-row items-center gap-4 text-sm">
			{session ? (
				<DropdownMenu>
					<DropdownMenuTrigger>{session.user?.name}</DropdownMenuTrigger>
					<DropdownMenuContent>
						<DropdownMenuItem>Profile</DropdownMenuItem>
						<DropdownMenuItem>Billing</DropdownMenuItem>
						<DropdownMenuSeparator />
						<DropdownMenuItem onClick={() => signOut()}>
							Sign Out
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			) : (
				<Button variant="ghost" onClick={() => signIn()}>
					Sign In
				</Button>
			)}
			<ModeToggle />
		</div>
	);
}

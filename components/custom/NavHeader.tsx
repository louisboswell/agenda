import Link from "next/link";
import {
	NavigationMenu,
	NavigationMenuItem,
	NavigationMenuLink,
	NavigationMenuList,
} from "../ui/navigation-menu";

export const navLinks = [
	{
		title: "Notes",
		href: "/notes",
	},
	{
		title: "Journal",
		href: "/journal",
	},
	{
		title: "Chat",
		href: "/chat",
	},
];

export default function NavHeader() {
	return (
		<NavigationMenu>
			<NavigationMenuList className="gap-4">
				{navLinks.map((navLink) => (
					<NavigationMenuItem key={navLink.title}>
						<NavigationMenuLink asChild>
							<Link href={navLink.href} className="font-semibold text-sm">
								{navLink.title}
							</Link>
						</NavigationMenuLink>
					</NavigationMenuItem>
				))}
			</NavigationMenuList>
		</NavigationMenu>
	);
}

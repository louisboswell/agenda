import Link from "next/link";
import AuthButton from "./AuthButton";
import NavHeader from "./NavHeader";

export default function Header() {
	return (
		<div className="w-screen flex flex-row justify-around p-2 items-center">
			<Link href="/">
				<h1 className="w-[200px] font-bold text-sm">Agenda</h1>
			</Link>
			<NavHeader />
			<AuthButton />
		</div>
	);
}

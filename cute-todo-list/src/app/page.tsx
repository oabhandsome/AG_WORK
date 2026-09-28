import Link from "next/link";
import { Button } from "@/components/ui/Button";
import Image from "next/image";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center flex-1 p-6 text-center">
      <div className="max-w-md w-full flex flex-col items-center bg-white p-8 rounded-3xl card-shadow cute-border relative overflow-hidden">

        <div className="w-48 h-48 relative mb-6">
          <Image
            src="/mascot.jpg"
            alt="Cute Mascot"
            fill
            className="object-contain"
            priority
          />
        </div>

        <h1 className="text-4xl font-extrabold text-text-dark mb-4">
          Cute To-do List
        </h1>
        <p className="text-text-light mb-8 font-medium">
          Organize your tasks with a sprinkle of cuteness! 💖
        </p>

        <div className="flex flex-col w-full gap-4">
          <Link href="/login" className="w-full">
            <Button className="w-full text-lg py-3">Login</Button>
          </Link>
          <Link href="/register" className="w-full">
            <Button variant="secondary" className="w-full text-lg py-3">Create Account</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

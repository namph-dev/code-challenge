import { CircleAlert } from "lucide-react";

export default function ErrorPage() {
  return (
    <main className="h-dvh w-dvw flex flex-col justify-center items-center p-10">
      <div className="inline-flex gap-2 items-center">
        <CircleAlert className="size-6" />
        <span className="text-base">Some thing went wrong</span>
      </div>
    </main>
  );
}

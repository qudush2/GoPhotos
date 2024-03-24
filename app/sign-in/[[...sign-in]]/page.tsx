import { SignIn } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center h-[80vh] pt-10">
      <SignIn />
    </div>
  );
}

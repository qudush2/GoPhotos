import { SignUp } from "@clerk/nextjs";

export default function Page() {
  return (
    <div className="flex justify-center mb-10">
      <SignUp />
    </div>
  );
}

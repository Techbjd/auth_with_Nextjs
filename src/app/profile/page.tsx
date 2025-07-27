import Link from "next/link";


export default function ProfilePage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <hr />
      <p>This is the profile page.</p>
      <Link href="/signup">Go to Signup Page</Link>
    </div>
  );
}
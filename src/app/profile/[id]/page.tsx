


export default async function UserProfile({ params }: { params: { id: string } }){
  const userID= params.id;
  return (
    <div className="flex flex-col items-center justify-center min-h-screen py-2">
      <h1>Profile Page</h1>
      <hr />
      <p className="text-4xl">This is the profile page.
        <span className="p-2 ml-2 bg-orange-500 text-black">{userID}</span>
      </p>

    </div>
  );
}
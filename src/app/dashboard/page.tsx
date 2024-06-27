import { getSession } from "@auth0/nextjs-auth0";

export default async function Dashboard() {
    const session  = await getSession();

    return (
        <>
            <h1>Dashboard</h1>
            <p>Welcome, {session?.user.name}</p>
        </>
    );
}

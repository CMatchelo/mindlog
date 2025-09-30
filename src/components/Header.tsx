import { useAuth } from "@/Contexts/AuthContext";

export const Header = () => {

    const { signOut } = useAuth();

    const handleSignOut = async () => {
        await signOut();
    }

    return (
        <header className="p-4 bg-primary1 text-white">
            <h1 className="text-2xl font-bold">Reorganizar</h1>
            <button onClick={handleSignOut}> Sair </button>
        </header>
    )
}
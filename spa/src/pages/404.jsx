import { Header } from "../components/header";
import { Link } from "react-router";

export function NotFound() {
    return (
        <div className="min-h-screen bg-slate-300">
            <Header />
            <div className=" flex-col self-center align-middle text-center ">
                <h1 className="text-9xl" >404</h1>
                <p className="text-2xl">Ops... essa página não existe</p>
                <Link to={"/"} className="text-blue-500">Voltar para home</Link>
            </div>
        </div>
    );
}
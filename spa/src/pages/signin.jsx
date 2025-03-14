import { Button } from "../components/button"
import { Header } from "../components/header"
import { Link } from "react-router"
import { Input } from "../components/input"
export function Signin() {
  return (
    <div className="bg-slate-300 min-h-screen grid grid-rows-[auto_1fr]">
      <Header />
      <section className="px-8 flex justify-center items-center">
        <form className="bg-slate-50 w-full rounded-xl p-8 space-y-4 max-w-lg lg:-mt-40">
          <h1 className="text-xl font-bold mb-4">Login</h1>
          <Input placeholder="Email" />
          <Input placeholder="Senha" />
          <Button>Entrar</Button>
          <p>Não possui uma conta? <Link className="text-blue-500 hover:text-blue-700" to="/signup" >Cadastre-se</Link></p>
        </form>
      </section>
    </div>
  )
}
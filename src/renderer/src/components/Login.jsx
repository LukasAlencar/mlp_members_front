import { useState } from 'react'
import logo from '../assets/mlpmembroslogo.png'
import axios from 'axios'
import { useNavigate } from 'react-router'


export const Login = () => {

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault()

    await axios.post('http://localhost:3001/login', {
      email,
      password
    }).then(res => {
      const token = res.data.token
      localStorage.setItem('token', token)
      navigate('/home')
    }).catch(err => {
      console.log(err.response.data)
      setError(err.response.data.message)
    })

  }

  return (
    <div className="w-full h-full flex flex-col gap-2 justify-center items-center">
      <section className="bg-zinc-800 rounded-lg p-5 flex flex-col justify-center items-center">
        <img src={logo} alt="mlp-membros" className='mb-5' />
        <span className='w-full border border-zinc-700 mb-5'></span>
        <h1 className="text-3xl font-bold mb-5">Entrar</h1>
        {error && <span className="text-red-500 text-center w-full mb-2">{error}</span>}
        <form className='w-full'>
          <div>
            <label className="text-lg" htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              className="w-full h-10 px-3 mt-1 bg-zinc-700 text-zinc-100 rounded-lg"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="mt-5">
            <label className="text-lg" htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              name="password"
              className="w-full h-10 px-3 mt-1 bg-zinc-700 text-zinc-100 rounded-lg"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className='flex justify-start items-center gap-2 mt-3'>
            <input className="accent-zinc-600" type="checkbox" name="remember" id="remember" />
            <label className="text-zinc-400" htmlFor="remember">Lembre-me</label>
          </div>
          <button
            onClick={handleLogin}
            type='submit'
            className="w-full h-10 mt-5 bg-zinc-700 text-zinc-100 rounded-lg"
          >
            Entrar
          </button>
        </form>
      </section>
    </div>
  )
}


export default Login

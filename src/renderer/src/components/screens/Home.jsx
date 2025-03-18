import { useNavigate } from "react-router";
import Sidebar from "../Sidebar";

export const Home = () => {

  const navigate = useNavigate();

  return (
    <div className="w-screen h-screen bg-zinc-950 text-zinc-100 overflow-hidden">
      <Sidebar/>
      <a className="cursor-pointer" onClick={()=>navigate('/')}>Logout</a>
      <div>Home</div>
    </div>
  )
}


export default Home

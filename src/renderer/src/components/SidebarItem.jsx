import { useNavigate } from "react-router";

export const SidebarItem = ({ icon, value, onClick, hoverBg }) => {

  const navigate = useNavigate();

  var color;

  switch(hoverBg){
    case "danger":
      color = "red"
      break;
    default:
      color = "zinc"
      break;
  }

  return (
    <a onClick={onClick} className={`cursor-pointer flex justify-start items-center gap-3 w-full py-2 px-4 hover:bg-${color}-800`}>
      {icon && icon}
      {value && value}
    </a>
  )
}


export default SidebarItem

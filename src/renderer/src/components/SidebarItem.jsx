
export const SidebarItem = ({ icon, value, onClick, hoverBg, active }) => {


  if (hoverBg == 'danger') {
    return (
      <a onClick={onClick} className={`cursor-pointer flex justify-start items-center gap-3 w-full py-2 px-4 hover:bg-red-800`}>
        {icon && icon}
        {value && value}
      </a>
    )
  } else {

    return (
      <a onClick={onClick} className={`cursor-pointer flex justify-start items-center gap-3 w-full py-2 px-4 hover:bg-zinc-800 ${active && 'bg-zinc-800'}`}>
        {icon && icon}
        {value && value}
      </a>
    )
  }

}


export default SidebarItem

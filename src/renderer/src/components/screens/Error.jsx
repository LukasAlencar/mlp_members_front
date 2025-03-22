
export const Error = ({children}) => {
  return (
    <div className="w-full h-full flex justify-center items-center bg-zinc-950 text-zinc-100">
        <p className="text-red-500">{children}</p>
    </div>
  )
}


export default Error

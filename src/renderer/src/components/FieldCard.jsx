export const FieldCard = ({ label, value, className }) => {

  let widthText = "text-base"

  if (value.length > 50) {
    widthText = "text-sm"
  }

  if (value.length > 70) {
    widthText = "text-xs"
  }

  if (value.length > 75) {
    widthText = "text-xs truncate"
  }

  return (
    <div className={className && className}>
      <span className="text-zinc-900 font-bold text-xs">
        {label}
      </span>
      <p className={`font-bold bg-zinc-200 rounded-md p-2 text-center justify-center items-center flex overflow-hidden ${widthText} whitespace-nowrap leading-none h-full w-full`}>
        {value}
      </p>
    </div>
  )
}


export default FieldCard

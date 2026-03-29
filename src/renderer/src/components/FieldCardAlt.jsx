export const FieldCardAlt = ({ label, value, className, isExport, id }) => {

  let widthText = "text-xl";

  if (value.length > 25) widthText = "text-lg";
  if (value.length > 30) widthText = "text-md";

  return (
    <div className={`w-[100%] text-white font-sans flex flex-col gap-1 ${isExport && ''}  ${className && className}`}>

      <label htmlFor={id} className="font-medium text-xs"
      >{label}</label>
      <span

        id={id}
        className={`uppercase font-bold pr-1 ${widthText} whitespace-nowrap ${isExport ? 'leading-none' : ''}`}
      >
        {value}
      </span>
    </div>
  );
};

export default FieldCardAlt;

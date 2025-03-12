
export function Input({placeholder, value, onChange, onKeyUp}) {
  return (
    <input
      className="p-1.5 px-3 border border-gray-300 rounded-md outline-none text-base w-full placeholder:text-base"
      placeholder={placeholder} 
      type="text"
      value={value}
      onChange={onChange}
      onKeyUp={onKeyUp} />
  )
}

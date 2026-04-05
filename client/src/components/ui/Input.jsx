function Input({placeholder,value,onChange}){

  return(

    <input
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      className="border p-3 rounded w-full"
    />

  )

}

export default Input
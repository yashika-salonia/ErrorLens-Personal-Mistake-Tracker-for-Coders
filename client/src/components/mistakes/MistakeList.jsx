import MistakeCard from "./MistakeCard";

function MistakeList({mistakes}){

  return(

    <div className="grid grid-cols-3 gap-6">

      {mistakes.map((m,i)=>(
        <MistakeCard key={i} mistake={m}/>
      ))}

    </div>

  )

}

export default MistakeList
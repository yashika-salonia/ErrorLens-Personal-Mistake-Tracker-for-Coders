import Card from "../ui/Card";

function MistakeCard({mistake}){

  return(

    <Card>

      <h3 className="font-bold text-lg">
        {mistake.title}
      </h3>

      <p className="text-gray-500">
        {mistake.category}
      </p>

    </Card>

  )

}

export default MistakeCard
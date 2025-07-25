import { Badge } from "@/components/ui/badge"
import { Link } from "react-router-dom";


const badges:string[] = [
  "All",
  "Gaming",
  "Counter-Strike 2",
  "Esports",
  "Music",
  "Valorant",
  "Mixes",
  "Live",
  "T-Series",
  "Battlegrounds Mobile India",
  "Movie musicals",
  "Indian pop music",
  "Computer programming",
  "Rockstar Games"
];


const Badges = () => {
  return (
<div className="px-4 pt-4 pb-2">
    <div className="flex gap-2  rounded-xl flex-wrap">
    {badges.map((i, id) => (
      <Badge variant="secondary" key={id} asChild>
        <Link to={"/"}>{i}</Link>
      </Badge>
    ))}
  </div>
</div>
  )
}

export default Badges
import React from "react";
import data from "@/Db.json";
import Video from "./VideoCard";
import { Badge } from "@/components/ui/badge";

const Home: React.FC = () => {


  const categories = [
    "All",
    "Gaming",
    "Music",
    "Live",
    "Coding",
    "News",
    "Recently uploaded",
  ];

  return (
    <div className="px-2 py-3">
      {/* Categories */}
      <div className="flex space-x-2 overflow-x-auto pb-4 ">
        {categories.map((category) => (
          <Badge key={category} variant={"secondary"}>{category}</Badge>
        ))}
      </div>

      {/* Videos Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-4">
        {data.map((video) => (
          <Video key={video.id} video={video} />
        ))}
      </div>
    </div>
  );
};

export default Home;

import React from "react";

import data from "./../../Db.json";
import Video from "./VideoCard";

const Home: React.FC = () => {
  console.log(data);
  return (
    <div className="grid  sm:grid-cols-1 md:grid-cols-3 lg:grid-cols-4 pb-10 gap-4  px-2 ">
      {data && data.map((item) => <Video key={item.id} video={item} />)}
    </div>
  );
};

export default Home;

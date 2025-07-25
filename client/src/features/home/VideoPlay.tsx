import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { formatDistanceToNow } from "date-fns";
import numeral from "numeral";
import React from "react";
import ReactPlayer from "react-player";
import { Download, Share2, ThumbsDown, ThumbsUp } from "lucide-react";
import { Link } from "react-router-dom";


const data = {
  id: "vid_1",
  title: "React Hooks Tutorial",
  description: "Learn how to use React hooks like useState and useEffect.",
  videoUrl:
    "https://sample-videos.com/video123/mp4/720/big_buck_bunny_720p_1mb.mp4",
  thumbnailUrl:
    "https://peach.blender.org/wp-content/uploads/title_anouncement.jpg?x11217",
  views: 12345,
  userId: "user_1",
  categoryId: "cat_1",
  createdAt: "2025-07-24T10:00:00Z",
};

const VideoPlay: React.FC = () => {
  console.log(data);
  const view = numeral(data.views).format("0.[0]a");
  const createdAt = formatDistanceToNow(data.createdAt, { addSuffix: true });
  return (
    <div className="w-full pt-4   px-4 flex flex-col lg:flex-row">
      <div className="lg:w-2/3">
        <ReactPlayer
          controls
          width="w-2/3"
          height={"500px"}
          src="https://www.youtube.com/watch?v=LXb3EKWsInQ"
        />
        <div>
          <span className="w-full inline-flex pt-5 lg:w-2/3 text-2xl ">
            {data.title}
          </span>
          <div className="flex  items-center w-full  pt-3">
            <div className="flex items-center w-1/3 gap-4 ">
              <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className="font-bold">
              {data.userId}
             
            </span>
             <Button className="rounded-full flex items-center justify-between px-9  bg-black">Button</Button>
            </div>
            <div className=" flex rounded-xl  w-[400px]  justify-around    ">
              <div className="flex ">
                <Button className="">
                  <ThumbsUp className="" /> |
                </Button>

                <Button className="">
                  <ThumbsDown />
                </Button>
              </div>
              <Button>
                <Share2 />
              </Button>
            </div>

            <Button>
              <Download />
            </Button>
          </div>
        </div>
        <div className="flex flex-col pt-5 rounded-2xl text-sm text-white pl-5 mt-5 h-30  w-full bg-black">
          <div className="flex flex-row gap-5">
            <span>{view}</span>
            <span>{createdAt}</span>
          </div>
          <span className="flex w-full font-semibold"> {data.description}</span>
        </div>
      </div>
      <div className="lg:w-1/3 lg:pt-3 lg:pl-6  pt-7">
      <div className="pt-3 ">
      <Link to={`/`}>
        <div className="hover:shadow-2xl">
          <img
            src={data?.thumbnailUrl}
            alt="image"
            className="rounded-t-xl relative top-[-25px] aspect-[16/9] object-cover"
          />

          <div className="flex mt-2 ml-2 items-center space-x-2  ">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className=" underline  underline-offset-4 font-bold text-center ">
              {data.title}
            
            </span>
          </div>

          <div>
            <div className="  flex space-x-4 ml-4 items-center text-xs">
              <span className="font-sans font-semibold  ">{data.userId}</span>
              <span className="flex text-gray-500 text-[16px]">{view}.</span>
              <span>{createdAt}</span>
            </div>
          </div>
        </div>
      </Link>
    </div>
      
      </div>


    </div>
  );
};

export default VideoPlay;

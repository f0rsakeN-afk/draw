import { Link } from "react-router-dom";
import numeral from "numeral";
import { formatDistanceToNow } from "date-fns";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

import { Card } from "@/components/ui/card";

const VideoCard = ({ video }: { video: Video }) => {
  const view = numeral(video.views).format("0.[0]a");
  const createdAt = formatDistanceToNow(video.createdAt, { addSuffix: true });
  return (
    <div className="pt-3 ">
      <Link to={`/`}>
        <Card className="hover:shadow-2xl">
          <img
            src={video?.thumbnailUrl}
            alt="image"
            className="rounded-t-xl relative top-[-25px] aspect-[16/9] object-cover"
          />

          <div className="flex mt-2 ml-2 items-center space-x-2  ">
            <Avatar>
              <AvatarImage src="https://github.com/shadcn.png" />
              <AvatarFallback>CN</AvatarFallback>
            </Avatar>
            <span className=" underline  underline-offset-4 font-bold text-center ">
              {video.title}
            
            </span>
          </div>

          <div>
            <div className="  flex space-x-4 ml-4 items-center text-xs">
              <span className="font-sans font-semibold  ">{video.userId}</span>
              <span className="flex text-gray-500 text-[16px]">{view}.</span>
              <span>{createdAt}</span>
            </div>
          </div>
        </Card>
      </Link>
    </div>
  );
};

export default VideoCard;

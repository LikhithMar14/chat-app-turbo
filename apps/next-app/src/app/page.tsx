import {Input, Switch} from "@repo/ui"
import { Button } from "@repo/ui";
import db from "@repo/db/client"
const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full">
      <div className="text-yellow-200  text-5xl">This is a TurboRepo 🚀</div>
      <Button variant={"secondary"} className="ml-2">Click here to Launch</Button>
    </div>
  )
};

export default Home;

import {Input, Switch} from "@repo/ui"
import { Button } from "@repo/ui";
const Home: React.FC = () => {
  return (
    <div className="flex items-center justify-center min-h-screen w-full bg-black">
      <div className="text-yellow-200  text-5xl">This is a TurboRepo 🚀</div>
      <Button variant={"secondary"} className="ml-2">Click here to Launch</Button>
    </div>
  )
};

export default Home;

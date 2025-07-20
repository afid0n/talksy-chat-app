import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTES from "./routes";
import ThreeBackground from "./components/three-background/ThreeBackground";
const router = createBrowserRouter(ROUTES);


function App() {
  return (
    <>
     <ThreeBackground />
      <RouterProvider router={router} />
    </>
   
  );
}

export default App;
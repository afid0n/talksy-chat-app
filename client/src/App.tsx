import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTES from "./routes";
import ThreeBackground from "./components/three-background/ThreeBackground";
const router = createBrowserRouter(ROUTES);
import { ThemeProvider } from "@/components/theme-provider"
 


function App() {
  return (
    <>
     <ThreeBackground />
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">    
      <RouterProvider router={router} />
      </ThemeProvider>
    </>
   
  );
}

export default App;
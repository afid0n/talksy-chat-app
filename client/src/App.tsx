import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTES from "./routes";
import ThreeBackground from "./components/three-background/ThreeBackground";
const router = createBrowserRouter(ROUTES);
import { ThemeProvider } from "@/components/theme-provider"
import { SnackbarProvider } from "notistack";
 


function App() {
  return (
    <>
    <SnackbarProvider maxSnack={3} />
     <ThreeBackground />
     <ThemeProvider defaultTheme="light" storageKey="vite-ui-theme">    
      <RouterProvider router={router} />
      </ThemeProvider>
    </>
   
  );
}

export default App;
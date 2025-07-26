import { createBrowserRouter, RouterProvider } from "react-router-dom";
import ROUTES from "./routes";
import ThreeBackground from "./components/three-background/ThreeBackground";
const router = createBrowserRouter(ROUTES);
import { ThemeProvider } from "@/components/theme-provider"
import { SnackbarProvider } from "notistack";
import { useEffect } from "react";
import socket from "./socket";
 


function App() {
    useEffect(() => {
    socket.connect();

    return () => {
      socket.disconnect();
    };
  }, []);
  return (
    <>
    <SnackbarProvider maxSnack={3}/>
     <ThreeBackground />
     <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">    
      <RouterProvider router={router} />
      </ThemeProvider>
    </>
   
  );
}

export default App;
import {createBrowserRouter, RouterProvider} from "react-router-dom";
import './App.css';
import { HomePage } from "./pages/Home";
import { QueryClientProvider, QueryClient } from "react-query";

const router = createBrowserRouter([
  {path: "/", element: <HomePage />},
  {path: "/:id", element: <HomePage />},
]);

const queryClient = new QueryClient();

function App() {
  return (
    <div className="App">
      <QueryClientProvider client={queryClient}>
        <RouterProvider router={router} />
      </QueryClientProvider>
    </div>
  );
}

export default App;

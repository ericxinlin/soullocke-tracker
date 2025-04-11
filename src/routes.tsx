import { redirect, RouteObject } from "react-router";
import Home from "./components/Home";
import RunPage from "./components/RunPage";
import SaveUpload from "./components/SaveUpload";

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/run/:runId",
    loader: async ({ params }) => {
      let res = await fetch(`/api/run/${params.runId}`);
      if (res.ok) {
        return await res.json();
      }
      return redirect("/404");
    },
    element: <RunPage />,
  },
  {
    path: "/upload",
    element: <SaveUpload />,
  },
];

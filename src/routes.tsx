import { RouteObject } from "react-router";
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
    element: <RunPage />,
  },
  {
    path: "/upload",
    element: <SaveUpload />,
  },
];

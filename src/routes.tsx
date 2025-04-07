import { RouteObject } from "react-router";
import Home from "./components/Home";
import SaveUpload from "./components/SaveUpload";

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <SaveUpload />,
  },
];

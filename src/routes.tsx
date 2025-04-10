import { RouteObject } from "react-router";
import Home from "./components/Home";

export const ROUTES: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
];

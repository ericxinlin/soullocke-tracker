import { RouteObject } from "react-router";
import SaveUpload from "./components/SaveUpload";

export const ROUTES: RouteObject[] = [
    {
        path: "/",
        element: <SaveUpload />,
    },
];
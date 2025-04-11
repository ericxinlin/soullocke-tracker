import { useLoaderData } from "react-router";
import RouteList from "./RouteList/RouteList";
import RunData from "../models/run";

export default function RunPage() {
  let data: RunData = useLoaderData();
  console.log(data);

  return <RouteList trainerId_1={2397798450} trainerId_2={0} />;
}

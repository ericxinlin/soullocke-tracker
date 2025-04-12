import RouteList from "./RouteList/RouteList";

interface ComponentProps {
  trainerId_1: number;
  trainerId_2: number;
}

export default function Timeline(props: ComponentProps) {
  return (
    <RouteList
      trainerId_1={props.trainerId_1}
      trainerId_2={props.trainerId_2}
    />
  );
}

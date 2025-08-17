import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  route("aggrid", "routes/aggrid.tsx"),
  route("home", "routes/home.tsx"),
  index("routes/cripto.tsx"),
] satisfies RouteConfig;

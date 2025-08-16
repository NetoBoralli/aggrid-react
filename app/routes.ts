import { type RouteConfig, index, route } from "@react-router/dev/routes";

export default [
  index("routes/aggrid.tsx"),
  route("home", "routes/home.tsx"),
  route("cripto", "routes/cripto.tsx"),
] satisfies RouteConfig;

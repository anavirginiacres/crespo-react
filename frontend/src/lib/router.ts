import {
  useNavigate,
  useParams,
  useLocation,
  useSearchParams as useRouterSearchParams,
} from "react-router-dom";

export function useRouter() {
  const navigate = useNavigate();
  return {
    push: (path: string) => navigate(path),
    refresh: () => window.location.reload(),
  };
}

export function useSearchParams() {
  const [params] = useRouterSearchParams();
  return params;
}

export { useParams };

export function usePathname() {
  return useLocation().pathname;
}

export function redirect(path: string) {
  window.location.href = path;
  return null;
}

export function notFound() {
  throw new Response("Not Found", { status: 404 });
}

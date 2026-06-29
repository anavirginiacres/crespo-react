import {
  Link as RouterLink,
  type LinkProps as RouterLinkProps,
} from "react-router-dom";

type AppLinkProps = Omit<RouterLinkProps, "to"> & {
  href: string;
};

export default function Link({ href, ...props }: AppLinkProps) {
  return <RouterLink to={href} {...props} />;
}

type AppImageProps = {
  src: string | { src?: string; default?: string };
  alt?: string;
  className?: string;
  fill?: boolean;
  sizes?: string;
  width?: number;
  height?: number;
  style?: React.CSSProperties;
  priority?: boolean;
  quality?: number;
  loading?: "lazy" | "eager" | string;
  decoding?: "async" | "auto" | "sync" | string;
  "aria-hidden"?: boolean;
};

export default function Image({
  src,
  alt = "",
  className,
  fill,
  style,
  loading,
  decoding,
  ...props
}: AppImageProps) {
  const resolved =
    typeof src === "string"
      ? src
      : src?.src || (typeof src?.default === "string" ? src.default : "");

  const imageStyle: React.CSSProperties = fill
    ? { objectFit: "cover", width: "100%", height: "100%", ...style }
    : style ?? {};

  return (
    <img
      src={resolved}
      alt={alt}
      className={className}
      style={imageStyle}
      loading={loading === "eager" ? "eager" : loading === "lazy" ? "lazy" : undefined}
      decoding={decoding as "async" | "auto" | "sync" | undefined}
      {...props}
    />
  );
}

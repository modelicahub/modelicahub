interface RgbyTextProps extends React.HTMLAttributes<HTMLSpanElement> {
  size: number | string;
  value: string;
}

export const RgbyText = ({ size, value, style }: RgbyTextProps) => {
  return (
    <span
      style={{
        fontFamily: " 'Supply Center', sans-serif",
        fontSize: typeof size === "string" ? size : `${size}px`,
        letterSpacing: "-0.1em",
        WebkitTextStroke: "0.08em var(--fgColor-default)",
        ...style,
      }}
    >
      {[...value].map((c, i) =>
        c === " " ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span
            key={i}
            style={{
              color: ["#e42926", "#45af49", "#0b9bd7", "#fbcf08"][i % 4],
            }}
          >
            {c}
          </span>
        ),
      )}
    </span>
  );
};

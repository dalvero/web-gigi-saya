type ButtonProps = {
  text: string;
  variant: "primary" | "secondary" | "alert";
};

export default function Button({ text, variant }: ButtonProps) {
  const styles: Record<ButtonProps["variant"], string> = {
    primary: "bg-primary text-white hover:bg-[#036540]",
    secondary: "bg-secondary text-white",
    alert: "bg-alert text-white",
  };

  return (
    <button
      className={`w-full py-2 rounded-lg font-semibold transition ${styles[variant]}`}
    >
      {text}
    </button>
  );
}

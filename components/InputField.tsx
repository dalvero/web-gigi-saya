type InputFieldProps = {
  label: string;
  placeholder?: string;
  type?: string;
};

export default function InputField({
  label,
  placeholder = "",
  type = "text",
}: InputFieldProps) {
  return (
    <div>
      <label className="block text-sm font-medium text-grey mb-1">
        {label}
      </label>
      <input
        type={type}
        placeholder={placeholder}
        className="w-full border border-lightGrey rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
      />
    </div>
  );
}

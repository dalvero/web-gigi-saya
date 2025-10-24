type HeaderProps = {
  name: string;
};

export default function Header({ name }: HeaderProps) {
  return (
    <header className="flex justify-between items-center px-5 py-4 bg-primary text-white rounded-b-2xl shadow-md">
      <div>
        <h1 className="text-lg font-semibold">Selamat pagi,</h1>
        <p className="text-xl font-bold">{name}</p>
      </div>
      <div className="flex gap-3">
        <div className="w-8 h-8 bg-white rounded-full" />
        <div className="w-8 h-8 bg-white rounded-full" />
      </div>
    </header>
  );
}

export default function ArticleCard() {
  return (
    <div className="flex gap-3 bg-[#F9F9F9] border border-lightGrey rounded-xl p-3 shadow-sm">
      <div className="w-20 h-20 bg-lightGrey rounded-lg"></div>
      <div className="flex flex-col justify-between">
        <p className="font-semibold text-sm">
          Anak sering mengeluh sakit gigi, apa penyebabnya?
        </p>
        <span className="text-xs text-grey">⭐ 3.8</span>
      </div>
    </div>
  );
}

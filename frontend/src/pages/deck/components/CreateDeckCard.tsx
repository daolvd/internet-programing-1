export default function CreateDeckCard() {
  return (
    <div className="flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-6 text-gray-400 transition duration-150 hover:border-blue-300 hover:bg-blue-50 hover:text-blue-600 active:scale-[0.99]">
      <div className="text-2xl">+</div>
      <p className="font-medium">Create New Deck</p>
    </div>
  );
}

import { Pair } from "@/components/Pool/Pair";
import { AddNewPair } from "@/components/Pool/newPair";

export default function Pool() {
  return (
    <div className="bg-gray-800 h-screen">
      <div className="overflow-hidden bg-gray-800 py-16 px-8">
        <div className="relative mx-auto max-w-4xl">
          <h2 className="text-center text-4xl font-bold tracking-tight text-white">
            TradeCoin Pools
          </h2>
          <AddNewPair />
          <Pair />
        </div>
      </div>
    </div>
  );
}

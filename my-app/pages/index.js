import { Fpart } from "@/components/Main/Fpart";
import { HowDoesItWorkinfo } from "@/components/Main/HowDoesItWorkInfo";
import { PoolInfo } from "@/components/Main/PoolInfo";
import { ExchangeInfo } from "@/components/Main/ExchangeInfo";
import { ApplicationInstructionInfo } from "@/components/Main/ApplicationInstructionInfo";
import { NewsInfo } from "@/components/Main/NewsInfo";
import { ContactusInfo } from "@/components/Main/ContactusInfo";

export default function Index() {
  return (
    <div>
      <Fpart />
      <div className="isolate bg-gradient-to-tl">
        <main>
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-5 pb-32 mt-4 sm:pb-40">
              <HowDoesItWorkinfo />
              <PoolInfo />
              <ExchangeInfo />
              <ApplicationInstructionInfo />
              <NewsInfo />
              <ContactusInfo />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

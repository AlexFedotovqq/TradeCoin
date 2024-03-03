import { Fpart } from "@/components/Main/Fpart";
import { HowDoesItWorkinfo } from "@/components/Main/Howdoesitworkinfo";
import { PoolInfo } from "@/components/Main/Poolinfo";
import { ExchangeInfo } from "@/components/Main/Exchangeinfo";
import { ApplicationInstructionInfo } from "@/components/Main/Applicationinstructioninfo";
import { NewsInfo } from "@/components/Main/Newsinfo";
import { ContactusInfo } from "@/components/Main/Contactusinfo";

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

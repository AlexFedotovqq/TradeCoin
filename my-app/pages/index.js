import { Fpart } from "@/components/Main/Fpart";
import { HowDoesItWorkinfo } from "@/components/Main/Howdoesitworkinfo";
import { Poolinfo } from "@/components/Main/Poolinfo";
import { Exchangeinfo } from "@/components/Main/Exchangeinfo";
import { Applicationinstructioninfo } from "@/components/Main/Applicationinstructioninfo";
import { Newsinfo } from "@/components/Main/Newsinfo";
import { Contactusinfo } from "@/components/Main/Contactusinfo";

export default function Index() {
  return (
    <div>
      <Fpart />
      <div className="isolate bg-gradient-to-tl">
        <main>
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-5 pb-32 mt-4 sm:pb-40">
              <div>
                <div>
                  <HowDoesItWorkinfo />
                </div>
                <div>
                  <Poolinfo />
                </div>
                <div>
                  <Exchangeinfo />
                </div>
                <div>
                  <Applicationinstructioninfo />
                </div>
                <div>
                  <Newsinfo />
                </div>
                <div>
                  <Contactusinfo />
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

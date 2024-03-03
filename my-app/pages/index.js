import { Hero } from "@/components/Main/Hero";
import { FAQ } from "@/components/Main/FAQ";
import { Pool } from "@/components/Main/Pool";
import { Exchange } from "@/components/Main/Exchange";
import { AppInstructions } from "@/components/Main/AppInstructions";
import { News } from "@/components/Main/News";
import { ContactUs } from "@/components/Main/ContactUs";

export default function Index() {
  return (
    <div>
      <Hero />
      <div className="isolate bg-gradient-to-tl">
        <main>
          <div className="relative px-6 lg:px-8">
            <div className="mx-auto max-w-3xl pt-5 pb-32 mt-4 sm:pb-40">
              <FAQ />
              <Pool />
              <Exchange />
              <AppInstructions />
              <News />
              <ContactUs />
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

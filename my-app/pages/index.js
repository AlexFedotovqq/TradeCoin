import { Hero } from "@/components/Main/Hero";
import { FAQ } from "@/components/Main/FAQ";
import { Pool } from "@/components/Main/Pool";
import { Exchange } from "@/components/Main/Exchange";
import { AppInstructions } from "@/components/Main/AppInstructions";
import { News } from "@/components/Main/News";
import { ContactUs } from "@/components/Main/ContactUs";
import useIntersectionObserver from "@/components/Main/useIntersectionObserver";

export default function Index() {
  const [faqRef, faqVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [poolRef, poolVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [exchangeRef, exchangeVisible] = useIntersectionObserver({
    threshold: 0.1,
  });
  const [appInstructionsRef, appInstructionsVisible] = useIntersectionObserver({
    threshold: 0.1,
  });
  const [newsRef, newsVisible] = useIntersectionObserver({ threshold: 0.1 });
  const [contactUsRef, contactUsVisible] = useIntersectionObserver({
    threshold: 0.1,
  });

  return (
    <div>
      <Hero />
      <div className="isolate bg-gradient-to-tl">
        <div className="relative px-6 lg:px-8">
          <div className="mx-auto max-w-3xl pt-5 pb-32 mt-4 sm:pb-40">
            <section
              ref={faqRef}
              className={`transition-opacity duration-700 ${faqVisible ? "opacity-100" : "opacity-0"}`}
            >
              <FAQ />
            </section>
            <section
              ref={poolRef}
              className={`transition-opacity duration-700 ${poolVisible ? "opacity-100" : "opacity-0"}`}
            >
              <Pool />
            </section>
            <section
              ref={exchangeRef}
              className={`transition-opacity duration-700 ${exchangeVisible ? "opacity-100" : "opacity-0"}`}
            >
              <Exchange />
            </section>
            <section
              ref={appInstructionsRef}
              className={`transition-opacity duration-700 ${appInstructionsVisible ? "opacity-100" : "opacity-0"}`}
            >
              <AppInstructions />
            </section>
            <section
              ref={newsRef}
              className={`transition-opacity duration-700 ${newsVisible ? "opacity-100" : "opacity-0"}`}
            >
              <News />
            </section>
            <section
              ref={contactUsRef}
              className={`transition-opacity duration-700 ${contactUsVisible ? "opacity-100" : "opacity-0"}`}
            >
              <ContactUs />
            </section>
          </div>
        </div>
      </div>
    </div>
  );
}

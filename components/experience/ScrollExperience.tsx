import { surpriseConfig } from "@/content/surprise";
import { WhyYouSection } from "@/components/sections/WhyYouSection";
import { MemoryStory } from "@/components/sections/MemoryStory";
import { PolaroidStack } from "@/components/sections/PolaroidStack";
import { DateChoice } from "@/components/sections/DateChoice";
import { SecretLetter } from "@/components/sections/SecretLetter";
import { EndingSection } from "@/components/sections/EndingSection";
import { SmoothScrollProvider } from "./SmoothScrollProvider";

export function ScrollExperience() {
  return (
    <SmoothScrollProvider>
      <div className="flex flex-col w-full relative bg-bg">
        <WhyYouSection reasons={surpriseConfig.reasons} content={surpriseConfig.whyYou} />
        <MemoryStory memories={surpriseConfig.memories} />
        <PolaroidStack polaroids={surpriseConfig.memories.slice(0, 4)} />
        <DateChoice choices={surpriseConfig.dateChoices} content={surpriseConfig.dateChoice} />
        <SecretLetter content={surpriseConfig.letter} />
        <EndingSection content={surpriseConfig.ending} />
      </div>
    </SmoothScrollProvider>
  );
}

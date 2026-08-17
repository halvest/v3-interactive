import { SurpriseExperience } from "@/components/experience/SurpriseExperience";

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen bg-bg text-text-primary selection:bg-accent/20">
      <SurpriseExperience />
    </div>
  );
}

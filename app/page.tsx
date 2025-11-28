import Link from "next/link";
import ContinueReadingSection from "./_components/ContinueReadingSection";
import SuggestRegistrationSection from "./_components/SuggestRegistrationSection";

export default async function Page() {
  // Hydrate all client components with data from the server

  return (
    <>
      <ContinueReadingSection />
      <SuggestRegistrationSection />
    </>
  );
}

import Link from "next/link";
import ContinueReadingSection from "./_components/ContinueReadingSection";
import SuggestRegistrationSection from "./_components/SuggestRegistrationSection";

export default async function Page() {
  // Server-side component.

  return (
    <>
      <ContinueReadingSection />
      <SuggestRegistrationSection />
    </>
  );
}

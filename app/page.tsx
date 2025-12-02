import CategoriesSection from "./_components/CategoriesSection";
import ContinueReadingSection from "./_components/ContinueReadingSection";
import FeaturedBookSection from "./_components/FeaturedBookSection";
import SuggestRegistrationSection from "./_components/SuggestRegistrationSection";

export default async function Page() {
  // Server-side component.

  return (
    <>
      <ContinueReadingSection />
      <SuggestRegistrationSection />
      <CategoriesSection />
      <FeaturedBookSection bookId="8w-YCgAAQBAJ" />
    </>
  );
}

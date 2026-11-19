import { Suspense } from "react";
import Banner from "./Components/Banner";
import CustomerTestimonials from "./Components/CustomerTestimonials";
import FeaturedServices, {
  FeaturedServicesFallback,
} from "./Components/FeaturedServices";
import HowWedPlanWorks from "./Components/HowWedPlanWorks";
import WeddingCategories from "./Components/WeddingCategories";


export default function Home() {
  return (
    <div>
      <Banner />
      <Suspense fallback={<FeaturedServicesFallback />}>
        <FeaturedServices />
      <WeddingCategories/>
      <HowWedPlanWorks />
      <CustomerTestimonials />
      </Suspense>
    </div>
  );
}

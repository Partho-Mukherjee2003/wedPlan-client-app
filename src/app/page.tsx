import Banner from "./Components/Banner";
import CustomerTestimonials from "./Components/CustomerTestimonials";
import FeaturedServices from "./Components/FeaturedServices";
import HowWedPlanWorks from "./Components/HowWedPlanWorks";
import WeddingCategories from "./Components/WeddingCategories";


export default function Home() {
  return (
    <div>
      <Banner />
      <FeaturedServices/>
      <WeddingCategories/>
      <HowWedPlanWorks />
      <CustomerTestimonials />
    </div>
  );
}

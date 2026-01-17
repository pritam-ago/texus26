import { permanentRedirect } from "next/navigation";

const BloodDonation = () => {
  permanentRedirect(
    "https://docs.google.com/forms/d/e/1FAIpQLSc_xLDfYSDpkS6bpMiCqn4rlmOEXcH79L-76Lqco18oaDaTJQ/viewform?pli=1"
  );
};

export default BloodDonation;

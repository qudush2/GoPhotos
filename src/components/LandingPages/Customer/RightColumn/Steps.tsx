import { Chip, Image } from "@nextui-org/react";

type StepsProps = {
  thumbnail: string;
  stepNumber: number;
  header: string;
  explainingText: string;
};

export function Steps({
  thumbnail,
  stepNumber,
  header,
  explainingText,
}: StepsProps) {
  return (
    <div className="space-y-3">
      <Image
        src={thumbnail}
        alt={header}
        className="rounded-md border border-gray-300 w-full object-cover shadow-xl mb-3"
      />
      <Chip className="bg-[#FFD1CC]" variant="flat">
        Step {stepNumber}
      </Chip>
      <p className="font-sans text-3xl font-semibold">{header}</p>
      <p className="font-sans text-lg text-gray-500">{explainingText}</p>
    </div>
  );
}

export const GoPhotosSteps = [
  {
    thumbnail: "/DiscoverPage.jpeg",
    stepNumber: 1,
    header: "Browse & Discover",
    explainingText:
      "Explore a diverse range of talented photographers. Use our intuitive search and filter options to find the perfect match for your event or project based on style, location, and budget.",
  },
  {
    thumbnail: "ProfilePage.jpeg",
    stepNumber: 2,
    header: "Review & Request",
    explainingText:
      'Dive into each photographer\'s portfolio to assess their work. When you find your ideal match, simply click the "Request Quote" button to start your booking process.',
  },
  {
    thumbnail: "MessagingPage.jpeg",
    stepNumber: 3,
    header: "Seamless Communication",
    explainingText:
      "Discuss project details effortlessly through our in-app messaging system. Never miss an important update - all messages sync with your email, ensuring you're always in the loop.",
  },
  {
    thumbnail: "PaymentPage.jpeg",
    stepNumber: 4,
    header: "Secure & Simple Payment",
    explainingText:
      "Experience worry-free transactions with our built-in payment system. Photographers receive payment only after you've received your photos. Need invoice payment? Contact payments@gophotos.us to enable this option on your account.",
  },
  {
    thumbnail: "GalleryPage.jpeg",
    stepNumber: 5,
    header: "Direct Photo Delivery",
    explainingText:
      "Access your final photos right on the platform. No need for external file-sharing services - simply log in to view, download, and share your stunning images from your personalized gallery.",
  },
];

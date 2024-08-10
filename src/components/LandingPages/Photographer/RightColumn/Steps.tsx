import { Chip, Image } from "@nextui-org/react";

type StepsProps = {
  thumbnail: string;
  tag: string;
  header: string;
  explainingText: string;
};

export function Steps({
  thumbnail,
  tag,
  header,
  explainingText,
}: StepsProps) {
  return (
    <div className="space-y-3">
        <Chip className="bg-[#FFD1CC] mb-3" variant="flat"> {tag}</Chip>
      <Image
        src={thumbnail}
        alt={header}
        className="rounded-md border border-gray-300 w-full object-cover shadow-xl mb-3"
      />
      <p className="font-sans text-3xl font-semibold">{header}</p>
      <p className="font-sans text-lg text-gray-500">{explainingText}</p>
    </div>
  );
}

export const GoPhotosSteps = [
  {
    thumbnail: "JobsPage.jpeg",
    tag: 'Exposure',
    header: "Expand Your Client Base",
    explainingText:
      "Access a diverse range of photography opportunities right at your fingertips. Our jobs page connects you with potential clients actively seeking your skills, helping you grow your business effortlessly.",
  },
  {
    thumbnail: "MessagingPage.jpeg",
    tag: 'Messaging',
    header: "Seamless Communication",
    explainingText:
      "Stay connected with clients through our intuitive in-app messaging system. Never miss an important update - all messages sync with your email, ensuring you're always in the loop and ready to capture the perfect shot.",
  },
  {
    thumbnail: "StripeAccount.jpeg",
    tag: 'Payment',
    header: "Hassle-Free Payments",
    explainingText:
      "Enjoy secure and timely payments for your work. Get paid promptly after delivering your photos, with no hidden fees. We ensure you keep 100% of your quoted price, maximizing your earnings for every project.",
  },
  {
    thumbnail: "GalleryPage.jpeg",
    tag: 'Client Galleries',
    header: "Direct Photo Delivery",
    explainingText:
      "Simplify your workflow by uploading finished photos directly to our platform. No need for external file-sharing services - just upload, organize, and share your stunning work all in one place.",
  },
];

import { Accordion, AccordionItem } from "@nextui-org/react";

export default function InfoStack() {
  return (
    <Accordion className="w-full max-w-3xl mx-auto">
      <AccordionItem
        key="1"
        aria-label="Find Local Photographers"
        title="Find Local Photographers"
      >
        <p className="text-gray-700">
          Discover talented photographers in your area with our advanced search
          and filtering system. Browse portfolios, compare styles, and find the
          perfect match for your event or project.
        </p>
      </AccordionItem>
      <AccordionItem
        key="2"
        aria-label="Seamless Communication"
        title="Seamless Communication"
      >
        <p className="text-gray-700">
          Connect effortlessly with photographers through our integrated
          messaging system. All communications are automatically synced with
          email, ensuring you never miss important details about your shoot.
        </p>
      </AccordionItem>
      <AccordionItem
        key="3"
        aria-label="Secure and Hassle-Free Payments"
        title="Secure and Hassle-Free Payments"
      >
        <p className="text-gray-700">
          Experience peace of mind with our built-in payment system. Make secure
          transactions and release funds only when you're satisfied with the
          final product.
        </p>
      </AccordionItem>
      <AccordionItem
        key="4"
        aria-label="Instant Photo Delivery"
        title="Instant Photo Delivery"
      >
        <p className="text-gray-700">
          Access your professionally edited photos directly on our platform. No
          need for external file-sharing services – simply download your images
          from your personal gallery.
        </p>
      </AccordionItem>
      <AccordionItem
        key="5"
        aria-label="All-in-One Booking Experience"
        title="All-in-One Booking Experience"
      >
        <p className="text-gray-700">
          Streamline your photography needs from start to finish. GoPhotos
          consolidates searching, booking, communicating, paying, and receiving
          photos into one seamless process, saving you time and effort.
        </p>
      </AccordionItem>
    </Accordion>
  );
}

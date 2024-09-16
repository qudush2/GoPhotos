import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@radix-ui/react-dialog";
import { X } from "lucide-react";

export default function Share({ convoID }: { convoID: string }) {
  const [copied, setCopied] = useState(false);
  const [emails, setEmails] = useState("");
  const [isOpen, setIsOpen] = useState(false);

  const handleCopyLink = () => {
    const currentUrl = window.location.href;
    navigator.clipboard.writeText(currentUrl).then(() => {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    });
  };

  const handleShareWithEmails = async (e: React.FormEvent) => {
    e.preventDefault();
    const email = emails.split(",").map((e) => e.trim());
    try {
      const response = await fetch("/api/emails/share-gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ convoID, email }),
      });
      if (!response.ok) {
        throw new Error("Failed to share gallery");
      }
      setIsOpen(false);
      setEmails("");
    } catch (error) {
      console.error("Error sharing gallery:", error);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <button className="bg-[#FC7674] hover:bg-[#fb5956] text-white font-bold py-2 px-4 rounded">
          Share
        </button>
      </DialogTrigger>
      <DialogContent className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
        <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full relative">
          <button
            onClick={() => setIsOpen(false)}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <X size={24} />
          </button>
          <DialogTitle className="text-xl font-bold mb-4">
            Share Gallery
          </DialogTitle>
          <div className="space-y-4">
            <button
              onClick={handleCopyLink}
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <form onSubmit={handleShareWithEmails} className="space-y-2">
              <input
                type="text"
                value={emails}
                onChange={(e) => setEmails(e.target.value)}
                placeholder="Enter email addresses, separated by commas"
                className="w-full px-3 py-2 border border-gray-300 rounded-md"
              />
              <button
                type="submit"
                className="w-full bg-green-500 hover:bg-green-600 text-white font-bold py-2 px-4 rounded"
              >
                Share with Emails
              </button>
            </form>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

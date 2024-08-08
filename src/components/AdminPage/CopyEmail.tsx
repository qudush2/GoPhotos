"use client";
import React, { useState } from "react";

interface CopyEmailsButtonProps {
  emails: string[];
}

export const CopyEmailsButton: React.FC<CopyEmailsButtonProps> = ({
  emails,
}) => {
  const [copySuccess, setCopySuccess] = useState("");

  const copyEmailsToClipboard = async () => {
    const emailString = emails.join(", ");
    await navigator.clipboard.writeText(emailString);
    setCopySuccess("Copied!");
    setTimeout(() => setCopySuccess(""), 2000); // Reset the message after 2 seconds
  };

  return (
    <div>
      <button
        onClick={copyEmailsToClipboard}
        className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-1 px-2 rounded"
      >
        Copy
      </button>
      {copySuccess && (
        <span className="ml-2 text-green-500">{copySuccess}</span>
      )}
    </div>
  );
};

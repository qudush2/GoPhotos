"use client";

import Talk from "talkjs";
import { useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Session, Inbox } from "@talkjs/react";
import { useRouter } from "next/navigation";
import { JobDetails, Customer } from "@/utils/types";

export default function ChatInbox({
  jobDetails,
  convoId,
  pgEmail,
  pgName,
  pgClerkID,
  customer,
}: {
  jobDetails?: JobDetails;
  convoId?: string;
  pgEmail?: string;
  pgName?: string;
  pgClerkID?: string;
  customer?: Customer;
}) {
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const id = user.id || "";

  const router = useRouter();
  const handleSubmit = (event: Talk.SelectConversationEvent) => {
    const conversation = event.conversation;
    const cID = conversation.id;
    router.push(`/messages/${encodeURIComponent(cID)}`);
  };

  const name = user.fullName || "";
  const email = user.emailAddresses[0].emailAddress || "";
  const phone = user.phoneNumbers[0] ? user.phoneNumbers[0].phoneNumber : null;
  const photoUrl = user.imageUrl || "";
  const role = user.publicMetadata.isPhotographer ? "Photographer" : "Customer";

  if (!convoId) {
    useEffect(() => {
      Talk.ready.then(function () {
        const me = new Talk.User({
          name: name,
          id: id,
          email: email,
          ...(phone ? { phone: phone } : {}),
          photoUrl: photoUrl,
          role: role,
        });
        const session = new Talk.Session({ appId: "tSzF029K", me: me }); //change to live mode
        const inbox = session.createInbox();

        inbox.mount(document.getElementById("inbox-container"));
        inbox.onSelectConversation(handleSubmit);
      });
    }, []);

    return (
      <div className="h-full w-full">
        <div id="inbox-container" className="h-full" />
      </div>
    );
  }

  if (convoId && pgEmail && pgName && pgClerkID && jobDetails && customer) {
    const syncUser = useCallback(
      () =>
        new Talk.User({
          name: name,
          id: id,
          email: email,
          ...(phone ? { phone: phone } : {}),
          photoUrl: photoUrl,
          role: role,
        }),
      []
    );

    const syncConversation = useCallback((session: Talk.Session) => {
      const conversation = session.getOrCreateConversation(convoId);

      let other;
      if (jobDetails.customer_clerk_id === id) {
        other = new Talk.User({
          id: pgClerkID,
          name: pgName,
          email: pgEmail,
          role: "Photographer",
        });
      } else {
        other = new Talk.User({
          id: customer.clerkid,
          name: customer.full_name,
          email: customer.email,
          role: "Customer",
        });
      }

      conversation.setParticipant(session.me);
      conversation.setParticipant(other);
      return conversation;
    }, []);

    return (
      //change appId
      <div className="h-full w-full">
        <Session syncUser={syncUser} appId="tSzF029K">
          <Inbox
            syncConversation={syncConversation}
            className="h-full"
            onSelectConversation={handleSubmit}
          />
        </Session>
      </div>
    );
  }
}

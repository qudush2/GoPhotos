"use client";

import Talk from "talkjs";
import { useEffect, useCallback } from "react";
import { useUser } from "@clerk/nextjs";
import { Session, Inbox } from "@talkjs/react";
import { useRouter } from "next/navigation";
import { JobDetails, Customer } from "@/src/utils/types";

const talk_id =
  process.env.NEXT_PUBLIC_TALK_DEV === "true"
    ? process.env.NEXT_PUBLIC_TALK_DEV_ID
    : process.env.NEXT_PUBLIC_TALK_PROD_ID;

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
  const router = useRouter();
  const { user } = useUser();

  if (!user) {
    return null;
  }

  const id = user.id || "";

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
        const session = new Talk.Session({ appId: talk_id as string, me: me });
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
    const { message_sent, event_title, event_date, description } = jobDetails;
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

      if (!message_sent) {
        const pgFirstName = pgName.split(" ")[0];
        const message = `Hey ${pgFirstName}, I am interested in booking you for ${event_title} on ${event_date}. Here is some more details: ${description}. Please let me know how much this will cost or if you need more information.`;
        conversation.sendMessage(message);
      }

      conversation.subject = event_title;
      return conversation;
    }, []);

    if (!message_sent) {
      useEffect(() => {
        const updateMessageSent = async () => {
          await fetch("/api/database-updates/update-message-sent", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ convoId }),
          });
        };
        updateMessageSent();
      });
    }

    return (
      <div className="h-full w-full">
        <Session syncUser={syncUser} appId={talk_id as string}>
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

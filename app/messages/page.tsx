"use client";
import Talk from "talkjs";
import { Session, Inbox } from "@talkjs/react";
import { useUser, useAuth } from "@clerk/nextjs";
import { useCallback, useRef } from "react";

export default function ChatPage() {
  // const session = useRef<Talk.Session>(); //???

  // const {isLoaded, user} = useUser()
  // if (!isLoaded) {
  //   console.log('here :(')
  // }

  // const {userId} = useAuth()
  // console.log('user ID',userId)

  // console.log('user full name',user?.fullName)

  // const syncUser = useCallback(
  //   () =>
  //     new Talk.User({
  //       id: "nina",
  //       name: "its me",
  //       email: "nina@example.com",
  //       role: "default",
  //       phone: "+13128434137",
  //     }),
  //   []
  // );

  // const syncConversation = useCallback((session: any) => {
  //   // JavaScript SDK code here
  //   const conversation = session.getOrCreateConversation("welcome");

  //   const other = new Talk.User({
  //     id: "frank",
  //     name: "frank",
  //     email: "frank@example.com",
  //     role: "default",
  //     phone: "+13128434137",
  //   });
  //   conversation.setParticipant(session.me);
  //   conversation.setParticipant(other);

  //   return conversation;
  // }, []);

  return (
    <div className="px-20">
      {/* <Session appId="tSzF029K" syncUser={syncUser}>
        <Inbox
        syncConversation = {syncConversation}
          className="w-full h-[500px]"
        ></Inbox>
      </Session> */}
    </div>
  );
}

// add to script.js for systemMessages similar to Airbnb
//
// conversation.setAttributes({
//   welcomeMessages: ["To protect your payment, always communicate and pay through the Airbnb website or app", "Hosts can’t see your profile photo until after your booking is confirmed."]
// })

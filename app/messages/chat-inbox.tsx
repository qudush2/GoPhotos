"use client";
import { Session, Inbox } from "@talkjs/react";
import { useUser } from "@clerk/nextjs";
import Talk from "talkjs";

export default function ChatInbox() {
  const { user } = useUser();

  Talk.ready.then(function() {
    const me = new Talk.User({
        id: 'user_2eW0b7fWQPDVUzVnqxzZb7qcZ1B',
        name: 'Person 2',
        email : 'qudush10@gmail.com'
    })
    // const otherUser = new Talk.User(photographerID)
    const otherUser = new Talk.User({
        id : 'user_2eW0b7fWQPDVUzVnqxzZb7qcZ1B',
        name : 'Qudus Shittu',
        email: 'qudus@mit.edu'
    })

    const session = new Talk.Session({
        appId : 'tSzF029K',
        me : me
    })

    const conversation = session.getOrCreateConversation('convoID')
    conversation.setParticipant(me)
    conversation.setParticipant(otherUser)
    conversation.sendMessage('Hey, this is a sample welcome message!')
})

  return (
    <div className="h-screen">
      <Session appId="tSzF029K" userId='user_2eW0b7fWQPDVUzVnqxzZb7qcZ1B'>
        <Inbox>
        </Inbox>
      </Session>
      {/* hello {user.id} */}
    </div>
  );
}

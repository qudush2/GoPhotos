'use client'

import Talk from "talkjs";

export function RequestQuoteButton({customerID, photographerID, convoID}: {customerID : string, photographerID: string, convoID : string}) { //pass in pgID, CID, convoID=

    Talk.ready.then(function() {
        const me = new Talk.User(customerID)
        // const otherUser = new Talk.User(photographerID)
        const otherUser = new Talk.User({
            id : photographerID,
            name : 'Qudus Shittu',
            email: 'qudush10@gmail.com'
        })

        const session = new Talk.Session({
            appId : 'tSzF029K',
            me : me
        })

        const conversation = session.getOrCreateConversation(convoID)
        conversation.setParticipant(me)
        conversation.setParticipant(otherUser)
        conversation.sendMessage('Hey, this is a sample welcome message!')
    })

    return (
        <div className="relative mt-2">
          <button
            type="submit"
            className="w-full rounded-md bg-black px-3 py-2 text-sm font-medium text-white"
          >
            Send request
          </button>
        </div>
      );
}
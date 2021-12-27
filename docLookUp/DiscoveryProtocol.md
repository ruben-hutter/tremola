# Discovery Protocol
-- version 1.0, 13.12.2021

## Idea
The overall goal is to find a peer's public key to be able to start a chat with him/her. As ssb is
a decentralized network, there is no easy way to find that person. Furthermore, the name of each
peer is self-attributed thus not unique. In order to find this peer, an Initiator send a UDP
broadcast asking for the public key of the target. The receiver can either discard the packet if 
doesn't understand it or if he already received this packet, transfer it if there is no entry 
corresponding to the targeted name in its database or send a packet to the query's initiator with 
the public key it found in its database or he is the target himself.
Then, the initiator can contact the target itself who then reply, as a traditional handshake 
procedure.


## Parties
There can be 4 different party :
- I, the initiator of the request
- T, the target of the request
- F, a friend of the target, i.e. someone that has the Target in its database
- Q, a quidam, a user that is neither the Initiator, the Target or a Friend

In addition, we define B as broadcast.

## Procedure
The protocol has 4 steps :
1 I -> B / Q -> B / I -> F / Q -> F / I -> T / Q -> T
  - the Initiator sends a broadcast message asking for the Target's public key, msg that is 
    transferred by any Quidam that receives it
2 F -> I / T -> I
  - a Friend (having the Target's public key in its database) or the Target himself sends the 
    Target's address as a reply to the Initiator
3 I -> T
  - the Initiator sends a msg to the Target with a signed token as an authentication check
4 T -> I
  - the Target answer the request and keeps a record of the Initiator's public key

{Do I need a 5 I->T to authenticate the Initiator for the Target?}
    

## Message description
### 1: Request for contact details
This message needs the contact detail of the Initiator and the query detail (including the 
Target's name). It also contains a hop count (to avoid the packet to be indefinitely transmitted),
a query identifier, which form a unique token <Initiator's public key, query identifier> in order
to identify the query and to let any user receiving more than once the same query discard it.


### 2: Reply with a suggested public key
This message contains the Target's public key, name (received from the query) and address, the 
Initiator's public key and address and the query identifier, as well as the hop count.

### 3, 4 and 5: initial handshake 
Being able to contact the Target, the Initiator can know launch a classic handshake procedure {to
be described in more details}


## Security concern
### 2 steps discovery
In order to mitigate spoofing, we have introduced a two-step introduction : first the targeted peer
is discovered by a friend who sends this information directly back to the initiator, who in turn
contacts the target directly. This feature can be used as an addition to the trust given by an 
answer, because a third party (the Friend) is acknowledging that the Target is indeed a true user.
Of course it is of no warranty, but it helps to choose in case of different answers.


## Points to be taken into account:
### Multiple replies
If the Initiator receives more than one valid replies, he has to choose which one to trust. The 
criteria have to be described precisely, but we have several hints for that :
  - the closeness between the Target and the Initiator, that can be deduced from the final hop count
  - the number of identical answers
  - information about the peer himself given by lower level's sbb implementation

Furthermore, it is possible for the Initiator to start the handshake (step 3) with more than one 
user. The reply (step 4) can help to make this decision, considering for example its existence, its
timing, etc. The Initiator can then abort the peering by not closing the handshake (step 5).
    

_____
To include :
- an opcode to describe the message's goal
- encryption / signing of the messages
- Does a dormant entry need to be discarded / not trusted anymore, i.e. does the entries have a 
  time-to-live?
  
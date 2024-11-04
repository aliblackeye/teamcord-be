import Peer from "simple-peer";

export type OngoingCall = {
  users: User[];
};

export type User = {
  socketId: string;
  username: string;
};

export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  username: string;
  avatar: string;
  systemMessage?: boolean;
};

export type NewMessage = {
  content: string;
  username: string;
  avatar: string;
};

export type Room = {
  channelId: string;
  users: User[];
  usersInCall: User[];
  messages: Message[];
};

export type Subscriber = {
  socketId: string;
};

export type PeerData = {
  peerConnection: Peer.Instance;
  stream: MediaStream | null;
  participant: User;
};

export type WebRTCSignal = {
  sdp: any;
  participant: User;
};

export type Channel = { channelId: string; subscribers: Subscriber[] };

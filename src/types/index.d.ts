export type SocketUser = {
  username: string;
  socketId: string;
};

export type OngoingCall = {
  participants: Participant[];
};

export type Participant = {
  username: string;
  socketId: string;
};

export type Message = {
  id: string;
  content: string;
  createdAt: Date;
  sender: string;
  avatar: string;
};

export type VoiceChannel = {
  channelId: string;
  subscribers: Participant[];
};

export type Subscriber = {
  socketId: string;
};

export type WebRTCSignal = {
  sdp: any;
  participant: Participant;
};

export type Channel = { channelId: string; subscribers: Subscriber[] };

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
  username: string;
  avatar: string;
  systemMessage?: boolean;
};

export type NewMessage = {
  content: string;
  username: string;
  avatar: string;
};

export type VoiceChannel = {
  channelId: string;
  subscribers: Participant[];
  messages: Message[];
};

export type Subscriber = {
  socketId: string;
};

export type WebRTCSignal = {
  sdp: any;
  participant: Participant;
};

export type Channel = { channelId: string; subscribers: Subscriber[] };

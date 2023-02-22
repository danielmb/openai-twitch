export interface GraphQlResponse {
  extensions: {
    durationMilliseconds: number;
    operationName?: string;
    requestID: string;
  };
}
export enum __typename {
  'User' = 'User',
  'Channel' = 'Channel',
  'Broadcast' = 'Broadcast',
  'Stream' = 'Stream',
  'Game' = 'Game',
  'BroadcastSettings' = 'BroadcastSettings',
}
export type DateTimeString =
  `${number}-${number}-${number}T${number}:${number}:${number}Z`;
export interface StreamMetadataResponse extends GraphQlResponse {
  data: {
    user: {
      id: string;
      primaryColorHex: string | null;
      isPartner: boolean;
      profileImageURL: string;
      primaryTeam: string | null;
      squadStream: string | null;
      channel: {
        id: StreamMetadataResponse['data']['user']['id'];
        chanlets: string | null;
        __typename: __typename.Channel;
      };
      lastBroadcast: {
        id: string | null;
        title: string | null;
        __typename: __typename.Broadcast;
      };
      stream: {
        id: string;
        type: string;
        createdAt: DateTimeString;
        __typename: __typename.Stream;
      } | null;
      __typename: __typename.User;
    };
  };
}

export interface ComscoreStreamingQueryResponse extends GraphQlResponse {
  data: {
    user: {
      id: string;
      displayName: string;
      stream: {
        id: string;
        createdAt: DateTimeString;
        game: {
          id: string;
          name: string;
          __typename: __typename.Game;
        };
        __typename: __typename.Stream;
      } | null;
      broadcastSettings: {
        id: ComscoreStreamingQueryResponse['data']['user']['id'];
        title: string | '';
        __typename: __typename.BroadcastSettings;
      };
      __typename: __typename.User;
    };
  };
}

export interface StreamPlaybackAccessTokenResponse extends GraphQlResponse {
  data: {
    streamPlaybackAccessToken: {
      value: string;
      signature: string;
    };
  };
}

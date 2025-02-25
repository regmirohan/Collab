export const mediaCodecs = [
    {
        kind        : "audio",
        mimeType    : "audio/opus",
        clockRate   : 48000,
        channels    : 2
      },
      {
        kind       : "video",
        mimeType   : "video/H264",
        clockRate  : 90000,
        parameters :
        {
          "packetization-mode"      : 1,
          "profile-level-id"        : "42e01f",
          "level-asymmetry-allowed" : 1
        }
      },
      {
        kind: 'video',
        mimeType: 'video/VP8',
        clockRate: 90000,
        parameters: {
          'x-google-start-bitrate': 1000
      }
    }    
]

export const transportCodecs = [
    {
        listenInfos :
        [
          {
            ip               : "0.0.0.0", 
            announcedIp      : "127.0.0.1"
            
          }
        ],
        enableUdp    : true,
        enableTcp    : true,
        preferUdp    : true
      }
]
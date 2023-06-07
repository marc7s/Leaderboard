/* Header */
export interface AT_Header {
    PacketFormat: number,
    GameMajorVersion: number,
    GameMinorVersion: number,
    PacketVersion: number,
    PacketID: number,
    SessionUID: number,
    SessionTime: number,
    FrameIdentifier: number,
    PlayerCarIndex: number,
    SecondaryPlayerCarIndex: number
}

export const _AT_HEADER_MAP_: object = {
    m_packetFormat: "PacketFormat",
    m_gameMajorVersion: "GameMajorVersion",
    m_gameMinorVersion: "GameMinorVersion",
    m_packetVersion: "PacketVersion",
    m_packetId: "PacketID",
    m_sessionUID: "SessionUID",
    m_sessionTime: "SessionTime",
    m_frameIdentifier: "FrameIdentifier",
    m_playerCarIndex: "PlayerCarIndex",
    m_secondaryPlayerCarIndex: "SecondaryPlayerCarIndex"
}
/* --- Header --- */
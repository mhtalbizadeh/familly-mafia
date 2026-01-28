export type ActionType =
  | "none"
  | "investigate"
  | "health"
  | "shot"
  | "block"
  | "silence"
  | "recruit"
  | "slaughter"
  | "giveItem"
  | "riskWake"
  | "buffOrCleanse"
  | "reviveVotedOut"
  | "revengeOnVoteOut"
  | "armor"
  | "alwaysNegative"
  | "nightImmunityTriggered";

export type ActionPhase = "intro" | "night" | "day" | "passive";

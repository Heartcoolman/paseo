import { useMemo } from "react";
import type { AgentCapabilityFlags } from "@getpaseo/protocol/agent-types";
import i18n from "@/i18n";

export type RewindMode = "conversation" | "files" | "both";

export interface RewindMenuItem {
  mode: RewindMode;
  label: string;
  testID: string;
}

export function resolveRewindMenuItems(
  capabilities:
    | Pick<
        AgentCapabilityFlags,
        "supportsRewindConversation" | "supportsRewindFiles" | "supportsRewindBoth"
      >
    | null
    | undefined,
): RewindMenuItem[] {
  if (!capabilities) {
    return [];
  }
  const items: RewindMenuItem[] = [];
  if (capabilities.supportsRewindConversation) {
    items.push({
      mode: "conversation",
      label: i18n.t("common.rewind.conversation"),
      testID: "rewind-menu-conversation",
    });
  }
  if (capabilities.supportsRewindFiles) {
    items.push({
      mode: "files",
      label: i18n.t("common.rewind.files"),
      testID: "rewind-menu-files",
    });
  }
  if (capabilities.supportsRewindBoth) {
    items.push({
      mode: "both",
      label: i18n.t("common.rewind.both"),
      testID: "rewind-menu-both",
    });
  }
  return items;
}

export function useRewindCapabilities(
  capabilities: Parameters<typeof resolveRewindMenuItems>[0],
): RewindMenuItem[] {
  return useMemo(() => resolveRewindMenuItems(capabilities), [capabilities]);
}

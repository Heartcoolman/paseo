import type { ComponentType } from "react";
import i18n from "@/i18n";
import type { PanelDescriptor, PanelIconProps } from "@/panels/panel-registry";

export function buildDraftPanelDescriptor(input: {
  isCreating: boolean;
  pendingPrompt?: string | null;
  icon: ComponentType<PanelIconProps>;
}): PanelDescriptor {
  const { icon, isCreating, pendingPrompt } = input;
  const creatingLabel = pendingPrompt?.trim() || i18n.t("agent.draftPanel.newAgent");
  if (isCreating) {
    return {
      label: creatingLabel,
      subtitle: i18n.t("agent.draftPanel.creatingAgent"),
      titleState: "ready",
      icon,
      statusBucket: "running",
    };
  }

  return {
    label: i18n.t("agent.draftPanel.newAgent"),
    subtitle: i18n.t("agent.draftPanel.newAgent"),
    titleState: "ready",
    icon,
    statusBucket: null,
  };
}

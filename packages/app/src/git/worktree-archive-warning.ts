import i18n from "@/i18n";
import { confirmDialog } from "@/utils/confirm-dialog";

export interface WorktreeArchiveRisk {
  isDirty?: boolean | null;
  aheadOfOrigin?: number | null;
  diffStat?: { additions: number; deletions: number } | null;
}

export interface WorktreeArchiveConfirmationInput extends WorktreeArchiveRisk {
  worktreeName: string;
}

function formatDiffStat(diffStat: WorktreeArchiveRisk["diffStat"]): string | null {
  if (!diffStat) {
    return null;
  }

  const parts: string[] = [];
  if (diffStat.additions > 0) {
    parts.push(i18n.t("git.archive.addedLineCount", { count: diffStat.additions }));
  }
  if (diffStat.deletions > 0) {
    parts.push(i18n.t("git.archive.deletedLineCount", { count: diffStat.deletions }));
  }

  return parts.length > 0 ? parts.join(", ") : null;
}

export function buildWorktreeArchiveRiskReasons(input: WorktreeArchiveRisk): string[] {
  const reasons: string[] = [];
  const diffStat = input.diffStat;
  const hasDiffStatChanges = diffStat ? diffStat.additions > 0 || diffStat.deletions > 0 : false;
  const hasUncommittedChanges =
    input.isDirty === true || (input.isDirty == null && hasDiffStatChanges);

  if (hasUncommittedChanges) {
    const diffStatLabel = formatDiffStat(diffStat);
    reasons.push(
      diffStatLabel
        ? i18n.t("git.archive.uncommittedChangesWithStat", { stat: diffStatLabel })
        : i18n.t("git.archive.uncommittedChanges"),
    );
  }

  if ((input.aheadOfOrigin ?? 0) > 0) {
    const aheadOfOrigin = input.aheadOfOrigin ?? 0;
    reasons.push(i18n.t("git.archive.unpushedCommitCount", { count: aheadOfOrigin }));
  }

  return reasons;
}

export function buildWorktreeArchiveConfirmationMessage(
  input: WorktreeArchiveConfirmationInput,
): string | null {
  const reasons = buildWorktreeArchiveRiskReasons(input);
  if (reasons.length === 0) {
    return null;
  }

  return reasons.join("\n");
}

export async function confirmRiskyWorktreeArchive(
  input: WorktreeArchiveConfirmationInput,
): Promise<boolean> {
  const message = buildWorktreeArchiveConfirmationMessage(input);
  if (!message) {
    return true;
  }

  return await confirmDialog({
    title: i18n.t("git.archive.confirmTitle", { name: input.worktreeName }),
    message,
    confirmLabel: i18n.t("git.action.archive"),
    cancelLabel: i18n.t("common.action.cancel"),
    destructive: true,
  });
}

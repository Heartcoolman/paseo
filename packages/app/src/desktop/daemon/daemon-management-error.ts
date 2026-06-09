import i18n from "@/i18n";

export class DaemonConnectionRegistrationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "DaemonConnectionRegistrationError";
  }
}

export class DaemonManagementOperationError extends Error {
  readonly originalError: Error;
  readonly wasManagingDaemon: boolean;

  constructor(error: Error, wasManagingDaemon: boolean) {
    super(error.message);
    this.name = error.name;
    this.cause = error;
    this.originalError = error;
    this.wasManagingDaemon = wasManagingDaemon;
  }
}

export interface DaemonManagementErrorPresentation {
  message: string;
  refreshStatus: boolean;
}

export function getDaemonManagementErrorPresentation(
  error: Error,
  isManagingDaemon: boolean,
): DaemonManagementErrorPresentation {
  const presentationError =
    error instanceof DaemonManagementOperationError ? error.originalError : error;
  const wasManagingDaemon =
    error instanceof DaemonManagementOperationError ? error.wasManagingDaemon : isManagingDaemon;

  if (presentationError instanceof DaemonConnectionRegistrationError) {
    return {
      message: i18n.t("desktop.daemon.registrationError"),
      refreshStatus: true,
    };
  }
  if (wasManagingDaemon) {
    return {
      message: i18n.t("desktop.daemon.pauseStopFailed"),
      refreshStatus: false,
    };
  }
  return {
    message: i18n.t("desktop.daemon.manageUpdateFailed"),
    refreshStatus: false,
  };
}

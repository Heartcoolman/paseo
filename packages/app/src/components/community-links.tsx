import { useCallback } from "react";
import { View } from "react-native";
import { useTranslation } from "react-i18next";
import { StyleSheet } from "react-native-unistyles";
import { Heart } from "lucide-react-native";
import { Button } from "@/components/ui/button";
import { GitHubIcon } from "@/components/icons/github-icon";
import { DiscordIcon } from "@/components/icons/discord-icon";
import { openExternalUrl } from "@/utils/open-external-url";

const renderGitHubIcon = (color: string) => <GitHubIcon color={color} size={14} />;
const renderDiscordIcon = (color: string) => <DiscordIcon color={color} size={14} />;

export function CommunityLinks() {
  const { t } = useTranslation();
  const handleOpenGitHub = useCallback(() => {
    void openExternalUrl("https://github.com/getpaseo/paseo");
  }, []);

  const handleOpenSponsor = useCallback(() => {
    void openExternalUrl("https://github.com/sponsors/boudra");
  }, []);

  const handleOpenDiscord = useCallback(() => {
    void openExternalUrl("https://discord.gg/jz8T2uahpH");
  }, []);

  return (
    <View style={styles.row}>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={renderGitHubIcon}
        onPress={handleOpenGitHub}
        testID="community-links-github-star"
      >
        {t("common.community.star")}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={Heart}
        onPress={handleOpenSponsor}
        testID="community-links-sponsor"
      >
        {t("common.community.sponsor")}
      </Button>
      <Button
        variant="ghost"
        size="sm"
        leftIcon={renderDiscordIcon}
        onPress={handleOpenDiscord}
        testID="community-links-discord"
      >
        {t("common.community.community")}
      </Button>
    </View>
  );
}

const styles = StyleSheet.create(() => ({
  row: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: 0,
  },
}));

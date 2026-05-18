// src/components/TalentBadge.tsx
import React from "react";
import { View, Text } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TALENT_BADGE, TALENT_ICONS } from "../constants/theme";

interface Props {
  skill?: any;
  small?: boolean;
}

export function TalentBadge({ skill, small = false }: Props) {
  const slug: string = skill?.category?.slug ?? "default";
  const name: string = skill?.category?.name ?? slug;
  const palette = TALENT_BADGE(slug);
  const icon = (TALENT_ICONS[slug] ?? "star-outline") as any;
  const fontSize = small ? 10 : 12;
  const iconSize = small ? 10 : 12;
  const px = small ? 7 : 10;
  const py = small ? 3 : 5;

  return (
    <View
      style={{
        flexDirection: "row",
        alignItems: "center",
        gap: 4,
        backgroundColor: palette.bg,
        paddingHorizontal: px,
        paddingVertical: py,
        borderRadius: 999,
      }}
    >
      <Ionicons name={icon} size={iconSize} color={palette.text} />
      <Text style={{ fontSize, color: palette.text, fontWeight: "500" }}>{name}</Text>
    </View>
  );
}

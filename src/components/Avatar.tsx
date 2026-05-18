// src/components/Avatar.tsx
import React from "react";
import { View, Text, Image } from "react-native";
import { TALENT_BADGE } from "../constants/theme";

interface Props {
  user?: any;
  size?: number;
}

export function Avatar({ user, size = 40 }: Props) {
  const name: string = user?.fullName ?? user?.username ?? "U";
  const initials = name
    .split(" ")
    .map((n: string) => n[0] ?? "")
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const slug: string = user?.skills?.[0]?.category?.slug ?? "default";
  const palette = TALENT_BADGE(slug);

  if (user?.avatarUrl) {
    return (
      <Image
        source={{ uri: user.avatarUrl }}
        style={{ width: size, height: size, borderRadius: size / 2 }}
      />
    );
  }

  return (
    <View
      style={{
        width: size,
        height: size,
        borderRadius: size / 2,
        backgroundColor: palette.bg,
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={{ fontSize: size * 0.36, fontWeight: "700", color: palette.text }}>
        {initials}
      </Text>
    </View>
  );
}

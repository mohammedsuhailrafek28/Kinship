// src/components/TalentCard.tsx
import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { Avatar } from "./Avatar";
import { TalentBadge } from "./TalentBadge";
import { VerifyTick } from "./VerifyTick";
import { COLORS, RADIUS, SHADOW } from "../constants/theme";

interface Props {
  user: any;
  onPress?: () => void;
}

export function TalentCard({ user, onPress }: Props) {
  return (
    <TouchableOpacity style={styles.card} onPress={onPress} activeOpacity={0.85}>
      <Avatar user={user} size={50} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
          <Text style={styles.name} numberOfLines={1}>{user?.fullName}</Text>
          {user?.verified && <VerifyTick size={14} />}
        </View>
        <Text style={styles.meta} numberOfLines={1}>{user?.city ?? ""}</Text>
        <View style={{ flexDirection: "row", gap: 5, marginTop: 6, flexWrap: "wrap" }}>
          {user?.skills?.slice(0, 2).map((s: any) => (
            <TalentBadge key={s.id} skill={s} small />
          ))}
        </View>
      </View>
      <View style={{ alignItems: "flex-end", gap: 4 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 2 }}>
          <Ionicons name="star" size={12} color={COLORS.gold} />
          <Text style={styles.rating}>4.9</Text>
        </View>
        {user?.available && (
          <View style={styles.avail}>
            <Text style={{ fontSize: 9, color: COLORS.success, fontWeight: "700" }}>OPEN</Text>
          </View>
        )}
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    marginBottom: 10,
    ...SHADOW.card,
  },
  name: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  rating: { fontSize: 12, color: COLORS.gold, fontWeight: "600" },
  avail: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 7,
    paddingVertical: 2,
    borderRadius: RADIUS.full,
  },
});

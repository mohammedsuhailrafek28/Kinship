// src/components/SuggestRow.tsx
import React from "react";
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from "react-native";
import { useQuery } from "@tanstack/react-query";
import { api } from "../lib/api";
import { Avatar } from "./Avatar";
import { COLORS, RADIUS } from "../constants/theme";

export function SuggestRow() {
  const { data } = useQuery({
    queryKey: ["suggestions"],
    queryFn: () =>
      api.get("/collaborations/suggested").then((r) => r.data?.data ?? r.data ?? []),
    staleTime: 5 * 60 * 1000,
  });

  const users: any[] = Array.isArray(data) ? data.slice(0, 8) : [];
  if (!users.length) return null;

  return (
    <View style={styles.wrap}>
      <Text style={styles.label}>people to connect with</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
      >
        {users.map((u: any) => (
          <View key={u.id} style={styles.card}>
            <Avatar user={u} size={44} />
            <Text style={styles.name} numberOfLines={1}>
              {(u.fullName ?? "").split(" ")[0]}
            </Text>
            <Text style={styles.skill} numberOfLines={1}>
              {u.skills?.[0]?.category?.name ?? "talent"}
            </Text>
            <TouchableOpacity style={styles.btn}>
              <Text style={styles.btnText}>+ connect</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { marginBottom: 4, marginTop: 8 },
  label: {
    fontSize: 11,
    color: COLORS.textTertiary,
    letterSpacing: 0.8,
    textTransform: "uppercase",
    paddingHorizontal: 16,
    marginBottom: 10,
    fontWeight: "600",
  },
  card: {
    width: 108,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    padding: 12,
    alignItems: "center",
    gap: 5,
  },
  name: { fontSize: 12, fontWeight: "700", color: COLORS.text },
  skill: { fontSize: 10, color: COLORS.textSecondary },
  btn: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: RADIUS.full,
    borderWidth: 0.5,
    borderColor: COLORS.primary,
  },
  btnText: { fontSize: 10, color: COLORS.primary, fontWeight: "600" },
});

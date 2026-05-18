// src/components/OpportunityCard.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { TalentBadge } from "./TalentBadge";
import { COLORS, RADIUS, SHADOW } from "../constants/theme";

interface Props {
  opp: any;
  onApply?: () => void;
}

export function OpportunityCard({ opp, onApply }: Props) {
  const [applied, setApplied] = useState(false);

  const handle = () => {
    setApplied(true);
    onApply?.();
  };

  return (
    <View style={styles.card}>
      <View style={styles.titleRow}>
        <Text style={styles.title} numberOfLines={2}>{opp?.title}</Text>
        {(opp?.applicationCount ?? 0) < 5 && (
          <View style={styles.newBadge}>
            <Text style={{ fontSize: 9, color: COLORS.success, fontWeight: "700" }}>NEW</Text>
          </View>
        )}
      </View>

      <View style={styles.metaRow}>
        {opp?.city && (
          <>
            <Ionicons name="location-outline" size={11} color={COLORS.textTertiary} />
            <Text style={styles.metaText}>{opp.city}</Text>
          </>
        )}
        {opp?.budgetFrom && (
          <>
            <Ionicons name="cash-outline" size={11} color={COLORS.textTertiary} style={{ marginLeft: 8 }} />
            <Text style={styles.metaText}>₹{opp.budgetFrom.toLocaleString()}</Text>
          </>
        )}
      </View>

      <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
        {opp?.talentType && (
          <TalentBadge
            skill={{ category: { slug: opp.talentType, name: opp.talentType } }}
            small
          />
        )}
      </View>

      {opp?.description && (
        <Text style={styles.desc} numberOfLines={2}>{opp.description}</Text>
      )}

      <TouchableOpacity
        style={[styles.btn, applied && styles.btnDone]}
        onPress={handle}
        disabled={applied}
      >
        <Text style={[styles.btnText, applied && { color: COLORS.success }]}>
          {applied ? "applied ✓" : "apply now"}
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    padding: 16,
    marginBottom: 12,
    ...SHADOW.card,
  },
  titleRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
    marginBottom: 8,
  },
  title: { flex: 1, fontSize: 15, fontWeight: "700", color: COLORS.text },
  newBadge: {
    backgroundColor: COLORS.successBg,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: RADIUS.full,
  },
  metaRow: { flexDirection: "row", alignItems: "center", marginBottom: 10 },
  metaText: { fontSize: 11, color: COLORS.textSecondary, marginLeft: 2 },
  desc: {
    fontSize: 13,
    color: COLORS.textTertiary,
    lineHeight: 19,
    marginBottom: 14,
  },
  btn: {
    alignSelf: "flex-start",
    paddingHorizontal: 18,
    paddingVertical: 9,
    borderRadius: RADIUS.full,
    backgroundColor: COLORS.primary,
  },
  btnDone: { backgroundColor: COLORS.successBg },
  btnText: { fontSize: 13, color: "#fff", fontWeight: "700" },
});

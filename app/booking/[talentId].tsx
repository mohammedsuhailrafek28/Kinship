// app/booking/[talentId].tsx
import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import Toast from "react-native-toast-message";
import { api } from "../../src/lib/api";
import { Avatar } from "../../src/components/Avatar";
import { TalentBadge } from "../../src/components/TalentBadge";
import { COLORS, RADIUS } from "../../src/constants/theme";

export default function Booking() {
  const { talentId } = useLocalSearchParams<{ talentId: string }>();
  const router = useRouter();

  const [form, setForm] = useState({
    date: "",
    venue: "",
    description: "",
    amount: "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const { data: talent } = useQuery({
    queryKey: ["profile", talentId],
    queryFn: () =>
      api.get(`/users/${talentId}`).then((r) => r.data?.data ?? r.data),
    enabled: !!talentId,
  });

  const validate = (): boolean => {
    const e: Record<string, string> = {};
    if (!form.date.trim()) e.date = "event date required";
    if (!form.venue.trim()) e.venue = "venue required";
    if (!form.description.trim()) e.description = "describe the event";
    const amt = parseInt(form.amount);
    if (!amt || amt < 500) e.amount = "minimum booking amount is ₹500";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleBook = async () => {
    if (!validate()) return;
    setLoading(true);
    try {
      await api.post("/payments/booking", {
        talentId,
        amountRupees: parseInt(form.amount),
        eventDetails: {
          date: form.date,
          venue: form.venue,
          description: form.description,
        },
      });
      Toast.show({ type: "success", text1: "Booking request sent! 🎭" });
      router.back();
    } catch {
      Toast.show({ type: "error", text1: "Booking failed", text2: "Please try again." });
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={24} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>book talent</Text>
        <View style={{ width: 32 }} />
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Talent card */}
        {talent && (
          <View style={styles.talentCard}>
            <Avatar user={talent} size={52} />
            <View style={{ flex: 1 }}>
              <Text style={styles.talentName}>{talent.fullName}</Text>
              <Text style={styles.talentMeta}>
                {talent.skills?.[0]?.category?.name} · {talent.city}
              </Text>
              {talent.pricingFrom && (
                <Text style={styles.pricing}>
                  from ₹{talent.pricingFrom.toLocaleString()}
                </Text>
              )}
            </View>
            {talent.skills?.[0] && (
              <TalentBadge skill={talent.skills[0]} small />
            )}
          </View>
        )}

        {/* Form fields */}
        {(
          [
            { key: "date",   label: "event date *",     ph: "e.g. 15 August 2025",  kb: "default" },
            { key: "venue",  label: "venue *",           ph: "e.g. Taj Hotel, Chennai", kb: "default" },
            { key: "amount", label: "your offer (₹) *", ph: "e.g. 15000",           kb: "number-pad" },
          ] as { key: string; label: string; ph: string; kb: string }[]
        ).map((f) => (
          <View key={f.key} style={styles.fieldGroup}>
            <Text style={styles.label}>{f.label}</Text>
            <TextInput
              style={[styles.input, errors[f.key] && styles.inputError]}
              placeholder={f.ph}
              placeholderTextColor={COLORS.textTertiary}
              value={(form as any)[f.key]}
              onChangeText={(v) => setForm({ ...form, [f.key]: v })}
              keyboardType={f.kb as any}
            />
            {errors[f.key] && <Text style={styles.errorText}>{errors[f.key]}</Text>}
          </View>
        ))}

        {/* Description */}
        <View style={styles.fieldGroup}>
          <Text style={styles.label}>event description *</Text>
          <TextInput
            style={[styles.input, styles.textArea, errors.description && styles.inputError]}
            placeholder="describe the event — type, audience, duration, expectations…"
            placeholderTextColor={COLORS.textTertiary}
            value={form.description}
            onChangeText={(v) => setForm({ ...form, description: v })}
            multiline
            numberOfLines={4}
            textAlignVertical="top"
          />
          {errors.description && <Text style={styles.errorText}>{errors.description}</Text>}
        </View>

        {/* Book button */}
        <TouchableOpacity
          style={[styles.bookBtn, loading && { opacity: 0.7 }]}
          onPress={handleBook}
          disabled={loading}
        >
          <LinearGradient
            colors={["#9F7AEA", "#7C5CFC"]}
            style={styles.bookBtnGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 0 }}
          >
            {loading ? (
              <ActivityIndicator color="#fff" size="small" />
            ) : (
              <>
                <Ionicons name="lock-closed" size={15} color="#fff" />
                <Text style={styles.bookBtnText}>
                  send booking request — ₹{parseInt(form.amount || "0").toLocaleString()}
                </Text>
              </>
            )}
          </LinearGradient>
        </TouchableOpacity>

        {/* Secure note */}
        <View style={styles.secureRow}>
          <Ionicons name="shield-checkmark-outline" size={13} color={COLORS.textTertiary} />
          <Text style={styles.secureText}>payments powered by Razorpay · fully secure</Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  closeBtn: { padding: 4 },
  title: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  body: { padding: 20, gap: 18, paddingBottom: 60 },
  talentCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.md,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    padding: 16,
  },
  talentName: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  talentMeta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  pricing: { fontSize: 12, color: COLORS.success, marginTop: 3, fontWeight: "600" },
  fieldGroup: { gap: 6 },
  label: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600" },
  input: {
    backgroundColor: COLORS.bgCard,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    borderRadius: RADIUS.sm,
    paddingHorizontal: 14,
    paddingVertical: 13,
    fontSize: 14,
    color: COLORS.text,
  },
  inputError: { borderColor: COLORS.error },
  textArea: { minHeight: 100 },
  errorText: { fontSize: 11, color: COLORS.error },
  bookBtn: { borderRadius: RADIUS.full, overflow: "hidden" },
  bookBtnGrad: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 15,
  },
  bookBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  secureRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    justifyContent: "center",
  },
  secureText: { fontSize: 11, color: COLORS.textTertiary },
});

// src/screens/OnboardingScreen.tsx
import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Animated,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
  StatusBar,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useAuthStore } from "../store/auth.store";
import { COLORS, RADIUS } from "../constants/theme";

const { width } = Dimensions.get("window");

const TALENTS = [
  { slug: "singing",     label: "singing",     icon: "musical-note-outline" },
  { slug: "dancing",     label: "dancing",     icon: "body-outline" },
  { slug: "cooking",     label: "cooking",     icon: "restaurant-outline" },
  { slug: "art",         label: "painting",    icon: "brush-outline" },
  { slug: "photography", label: "photography", icon: "camera-outline" },
  { slug: "comedy",      label: "comedy",      icon: "happy-outline" },
  { slug: "fitness",     label: "fitness",     icon: "barbell-outline" },
  { slug: "fashion",     label: "fashion",     icon: "shirt-outline" },
  { slug: "music",       label: "music",       icon: "musical-notes-outline" },
  { slug: "poetry",      label: "poetry",      icon: "pencil-outline" },
];

export function OnboardingScreen() {
  const router = useRouter();
  const { register } = useAuthStore();

  const [step, setStep] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [form, setForm] = useState({
    username: "",
    fullName: "",
    email: "",
    password: "",
    city: "",
    bio: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fadeAnim = useRef(new Animated.Value(1)).current;

  const goStep = (n: number) => {
    Animated.timing(fadeAnim, { toValue: 0, duration: 140, useNativeDriver: true }).start(() => {
      setStep(n);
      Animated.timing(fadeAnim, { toValue: 1, duration: 220, useNativeDriver: true }).start();
    });
  };

  const toggle = (slug: string) =>
    setSelected((p) => (p.includes(slug) ? p.filter((s) => s !== slug) : [...p, slug]));

  const handleJoin = async () => {
    if (!form.fullName || !form.email || !form.password || !form.username) {
      setError("please fill all required fields");
      return;
    }
    if (form.password.length < 8) {
      setError("password must be at least 8 characters");
      return;
    }
    setLoading(true);
    setError("");
    try {
      await register(form);
      router.replace("/(tabs)/feed");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "something went wrong. try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" />
      <LinearGradient colors={["#0D0D0F", "#13111C", "#0D0D0F"]} style={StyleSheet.absoluteFill} />
      <View style={styles.glow1} />
      <View style={styles.glow2} />

      {step > 0 && (
        <View style={styles.dots}>
          {[1, 2, 3].map((i) => (
            <View key={i} style={[styles.dot, step >= i && styles.dotActive]} />
          ))}
        </View>
      )}

      <Animated.View style={[styles.content, { opacity: fadeAnim }]}>

        {/* ── STEP 0: Welcome ── */}
        {step === 0 && (
          <View style={styles.slide}>
            <View style={styles.logoWrap}>
              <LinearGradient
                colors={["#9F7AEA", "#7C5CFC", "#5438D0"]}
                style={styles.logo}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
              >
                <Text style={styles.logoLetter}>K</Text>
              </LinearGradient>
            </View>
            <Text style={styles.headline}>where every{"\n"}talent{"\n"}shines.</Text>
            <Text style={styles.sub}>
              Your professional home — whether you sing, cook, dance, paint,
              or do something the world hasn't discovered yet.
            </Text>
            <View style={{ flex: 1 }} />
            <TouchableOpacity style={styles.primaryBtn} onPress={() => goStep(1)}>
              <LinearGradient
                colors={["#9F7AEA", "#7C5CFC"]}
                style={styles.btnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryBtnText}>get started</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
            <TouchableOpacity style={styles.ghostBtn} onPress={() => router.push("/(auth)/login")}>
              <Text style={styles.ghostBtnText}>already have an account? sign in</Text>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 1: Pick Talents ── */}
        {step === 1 && (
          <View style={styles.slide}>
            <Text style={styles.stepTitle}>what's your{"\n"}talent?</Text>
            <Text style={styles.stepSub}>pick everything that applies — add more later</Text>
            <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
              <View style={styles.talentGrid}>
                {TALENTS.map((t) => {
                  const sel = selected.includes(t.slug);
                  return (
                    <TouchableOpacity
                      key={t.slug}
                      style={[styles.talentOpt, sel && styles.talentOptSel]}
                      onPress={() => toggle(t.slug)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={t.icon as any}
                        size={22}
                        color={sel ? COLORS.primary : COLORS.textSecondary}
                      />
                      <Text style={[styles.talentLabel, sel && { color: COLORS.primary }]}>
                        {t.label}
                      </Text>
                      {sel && (
                        <View style={styles.selCheck}>
                          <Ionicons name="checkmark" size={10} color="#fff" />
                        </View>
                      )}
                    </TouchableOpacity>
                  );
                })}
              </View>
            </ScrollView>
            <TouchableOpacity
              style={[styles.primaryBtn, selected.length === 0 && { opacity: 0.4 }]}
              onPress={() => selected.length > 0 && goStep(2)}
            >
              <LinearGradient
                colors={["#9F7AEA", "#7C5CFC"]}
                style={styles.btnGrad}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
              >
                <Text style={styles.primaryBtnText}>continue</Text>
                <Ionicons name="arrow-forward" size={16} color="#fff" />
              </LinearGradient>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 2: Build Profile ── */}
        {step === 2 && (
          <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
          >
            <View style={styles.slide}>
              <Text style={styles.stepTitle}>build your{"\n"}profile</Text>
              <Text style={styles.stepSub}>just the basics — edit everything later</Text>
              <ScrollView showsVerticalScrollIndicator={false} style={{ flex: 1 }}>
                <View style={styles.form}>
                  {[
                    { key: "fullName",  label: "full name *",    ph: "Nadia Jayaraj",             lower: false, secure: false, kb: "default" },
                    { key: "username",  label: "username *",     ph: "nadia_sings",                lower: true,  secure: false, kb: "default" },
                    { key: "email",     label: "email *",        ph: "you@email.com",             lower: true,  secure: false, kb: "email-address" },
                    { key: "password",  label: "password *",     ph: "min 8 characters",          lower: false, secure: true,  kb: "default" },
                    { key: "city",      label: "city",           ph: "Chennai, India",            lower: false, secure: false, kb: "default" },
                    { key: "bio",       label: "one-line bio",   ph: "jazz vocalist · 5 yrs",    lower: false, secure: false, kb: "default" },
                  ].map((f) => (
                    <View key={f.key} style={styles.inputGroup}>
                      <Text style={styles.inputLabel}>{f.label}</Text>
                      <TextInput
                        style={styles.input}
                        placeholder={f.ph}
                        placeholderTextColor={COLORS.textTertiary}
                        value={(form as any)[f.key]}
                        onChangeText={(v) =>
                          setForm({ ...form, [f.key]: f.lower ? v.toLowerCase() : v })
                        }
                        secureTextEntry={f.secure}
                        keyboardType={f.kb as any}
                        autoCapitalize={f.lower ? "none" : "words"}
                      />
                    </View>
                  ))}
                  {error ? (
                    <View style={styles.errorBox}>
                      <Ionicons name="alert-circle-outline" size={14} color={COLORS.error} />
                      <Text style={styles.errorText}>{error}</Text>
                    </View>
                  ) : null}
                </View>
              </ScrollView>
              <TouchableOpacity
                style={[styles.primaryBtn, loading && { opacity: 0.7 }]}
                onPress={handleJoin}
                disabled={loading}
              >
                <LinearGradient
                  colors={["#FF7452", "#FF6B52"]}
                  style={styles.btnGrad}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  {loading ? (
                    <ActivityIndicator color="#fff" size="small" />
                  ) : (
                    <>
                      <Text style={styles.primaryBtnText}>join kinship</Text>
                      <Ionicons name="sparkles" size={16} color="#fff" />
                    </>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </KeyboardAvoidingView>
        )}
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg, overflow: "hidden" },
  glow1: {
    position: "absolute", width: 300, height: 300, borderRadius: 150,
    backgroundColor: COLORS.primaryGlow, top: -80, left: -80, opacity: 0.6,
  },
  glow2: {
    position: "absolute", width: 200, height: 200, borderRadius: 100,
    backgroundColor: "#FF6B5220", bottom: 100, right: -50,
  },
  dots: {
    flexDirection: "row", gap: 6, justifyContent: "center",
    paddingTop: 60, paddingBottom: 4,
  },
  dot: { width: 6, height: 6, borderRadius: 3, backgroundColor: COLORS.bgElevated },
  dotActive: { backgroundColor: COLORS.primary, width: 20 },
  content: { flex: 1 },
  slide: { flex: 1, padding: 28, paddingTop: 20 },
  logoWrap: { marginBottom: 36 },
  logo: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: "center", justifyContent: "center",
  },
  logoLetter: { fontSize: 28, fontWeight: "800", color: "#fff" },
  headline: {
    fontSize: 48, fontWeight: "800", color: COLORS.text, lineHeight: 52, marginBottom: 18,
  },
  sub: { fontSize: 15, color: COLORS.textSecondary, lineHeight: 24 },
  primaryBtn: { borderRadius: RADIUS.full, overflow: "hidden", marginBottom: 12 },
  btnGrad: {
    flexDirection: "row", alignItems: "center",
    justifyContent: "center", gap: 8, paddingVertical: 16,
  },
  primaryBtnText: { fontSize: 16, fontWeight: "700", color: "#fff" },
  ghostBtn: { alignItems: "center", paddingVertical: 12 },
  ghostBtnText: { fontSize: 13, color: COLORS.textSecondary },
  stepTitle: {
    fontSize: 36, fontWeight: "800", color: COLORS.text, lineHeight: 42, marginBottom: 8,
  },
  stepSub: { fontSize: 13, color: COLORS.textSecondary, marginBottom: 20 },
  talentGrid: { flexDirection: "row", flexWrap: "wrap", gap: 10 },
  talentOpt: {
    width: "47%", flexDirection: "row", alignItems: "center", gap: 10,
    padding: 14, borderRadius: RADIUS.md, borderWidth: 0.5,
    borderColor: COLORS.border, backgroundColor: COLORS.bgCard,
    position: "relative", overflow: "hidden",
  },
  talentOptSel: { borderColor: COLORS.primary },
  talentLabel: { fontSize: 13, color: COLORS.textSecondary, fontWeight: "500" },
  selCheck: {
    position: "absolute", top: 8, right: 8, width: 16, height: 16,
    borderRadius: 8, backgroundColor: COLORS.primary,
    alignItems: "center", justifyContent: "center",
  },
  form: { gap: 14, paddingBottom: 20 },
  inputGroup: { gap: 6 },
  inputLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "600" },
  input: {
    backgroundColor: COLORS.bgElevated, borderWidth: 0.5, borderColor: COLORS.border,
    borderRadius: RADIUS.sm, paddingHorizontal: 16, paddingVertical: 13,
    fontSize: 14, color: COLORS.text,
  },
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: COLORS.errorBg, borderRadius: RADIUS.sm, padding: 10,
  },
  errorText: { fontSize: 13, color: COLORS.error, flex: 1 },
});

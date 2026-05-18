// src/screens/ProfileScreen.tsx
import React, { useState, useRef, useEffect } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useLocalSearchParams, useRouter } from "expo-router";
import { api } from "../lib/api";
import { getSocket } from "../lib/socket";
import { useAuthStore } from "../store/auth.store";
import { Avatar } from "../components/Avatar";
import { TalentBadge } from "../components/TalentBadge";
import { VerifyTick } from "../components/VerifyTick";
import { COLORS, RADIUS, SHADOW } from "../constants/theme";

// ─────────────────────────────────────────────────────────────────────────────
// PROFILE SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export function ProfileScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id?: string }>();
  const { user: me } = useAuthStore();
  const isOwn = !id || id === me?.id;
  const userId = isOwn ? me?.id : id;

  const { data: user, isLoading } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () =>
      isOwn
        ? api.get("/users/me").then((r) => r.data?.data ?? r.data)
        : api.get(`/users/${userId}`).then((r) => r.data?.data ?? r.data),
    enabled: !!userId,
  });

  const { data: posts } = useQuery({
    queryKey: ["user-posts", userId],
    queryFn: () =>
      api.get(`/feed/user/${userId}`).then((r) => r.data?.data ?? r.data ?? []),
    enabled: !!userId,
  });

  if (isLoading) {
    return (
      <View style={profSt.loader}>
        <ActivityIndicator color={COLORS.primary} size="large" />
      </View>
    );
  }

  const postList: any[] = Array.isArray(posts) ? posts : [];

  return (
    <ScrollView style={profSt.container} showsVerticalScrollIndicator={false}>
      {/* Hero gradient */}
      <LinearGradient colors={["#1A1040", "#0D0D0F"]} style={profSt.heroBg} />

      <View style={profSt.hero}>
        <TouchableOpacity style={profSt.backBtn} onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>

        <Avatar user={user} size={80} />

        <View style={profSt.nameRow}>
          <Text style={profSt.name}>{user?.fullName}</Text>
          {user?.verified && <VerifyTick size={18} />}
        </View>
        <Text style={profSt.tagline}>
          {user?.skills?.[0]?.category?.name ?? "talent"} · {user?.city ?? ""}
        </Text>

        {/* Stats */}
        <View style={profSt.statsRow}>
          {[
            { n: user?.totalConnections ?? 0, l: "connections" },
            { n: user?.totalPosts ?? 0,        l: "posts" },
            { n: user?.totalAppreciations ?? 0, l: "appreciations" },
          ].map((s, i) => (
            <View key={i} style={[profSt.stat, i < 2 && profSt.statBorder]}>
              <Text style={profSt.statN}>{s.n}</Text>
              <Text style={profSt.statL}>{s.l}</Text>
            </View>
          ))}
        </View>

        {/* Actions */}
        {isOwn ? (
          <TouchableOpacity style={profSt.editBtn}>
            <Text style={{ fontSize: 13, color: COLORS.text, fontWeight: "600" }}>edit profile</Text>
          </TouchableOpacity>
        ) : (
          <View style={profSt.actionRow}>
            <TouchableOpacity
              style={profSt.msgBtn}
              onPress={() => router.push(`/chat/${user?.id}`)}
            >
              <Ionicons name="chatbubble-outline" size={15} color="#fff" />
              <Text style={{ fontSize: 13, color: "#fff", fontWeight: "600" }}>message</Text>
            </TouchableOpacity>
            <TouchableOpacity style={profSt.connectBtn}>
              <Text style={{ fontSize: 13, color: COLORS.primary, fontWeight: "600" }}>
                + connect
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={profSt.bookBtn}
              onPress={() => router.push(`/booking/${user?.id}`)}
            >
              <Ionicons name="briefcase-outline" size={18} color={COLORS.coral} />
            </TouchableOpacity>
          </View>
        )}
      </View>

      {/* Bio */}
      {user?.bio ? (
        <View style={profSt.section}>
          <Text style={profSt.bio}>{user.bio}</Text>
        </View>
      ) : null}

      {/* Skills */}
      {user?.skills?.length > 0 && (
        <View style={[profSt.section, { flexDirection: "row", flexWrap: "wrap", gap: 8 }]}>
          {user.skills.map((s: any) => (
            <TalentBadge key={s.id} skill={s} />
          ))}
        </View>
      )}

      {/* Portfolio */}
      <View style={profSt.sectionHeader}>
        <Text style={profSt.sectionTitle}>portfolio</Text>
      </View>
      <View style={profSt.grid}>
        {postList.length === 0 ? (
          <Text style={profSt.emptyGrid}>no posts yet</Text>
        ) : (
          postList.map((p: any) => (
            <TouchableOpacity
              key={p.id}
              style={profSt.gridCell}
              onPress={() => router.push(`/post/${p.id}`)}
            >
              <LinearGradient colors={["#1a1a2e", "#16213e"]} style={StyleSheet.absoluteFill} />
              <Ionicons
                name={p.mediaType === "video" ? "play-circle-outline" : "image-outline"}
                size={24}
                color="rgba(255,255,255,0.5)"
              />
            </TouchableOpacity>
          ))
        )}
      </View>

      <View style={{ height: 100 }} />
    </ScrollView>
  );
}

const profSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  loader: { flex: 1, alignItems: "center", justifyContent: "center", backgroundColor: COLORS.bg },
  heroBg: { position: "absolute", top: 0, left: 0, right: 0, height: 280 },
  hero: {
    alignItems: "center", paddingTop: 60, paddingBottom: 24, paddingHorizontal: 20,
  },
  backBtn: { position: "absolute", top: 56, left: 16, padding: 4 },
  nameRow: { flexDirection: "row", alignItems: "center", gap: 8, marginTop: 12 },
  name: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  tagline: { fontSize: 13, color: COLORS.textSecondary, marginTop: 4 },
  statsRow: {
    flexDirection: "row", width: "100%", marginTop: 20,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.md,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  stat: { flex: 1, alignItems: "center", paddingVertical: 14 },
  statBorder: { borderRightWidth: 0.5, borderRightColor: COLORS.border },
  statN: { fontSize: 18, fontWeight: "800", color: COLORS.text },
  statL: { fontSize: 10, color: COLORS.textTertiary, marginTop: 2 },
  actionRow: { flexDirection: "row", gap: 8, marginTop: 16, width: "100%" },
  msgBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 6, paddingVertical: 11, borderRadius: RADIUS.sm, backgroundColor: COLORS.primary,
  },
  connectBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 11, borderRadius: RADIUS.sm,
    borderWidth: 0.5, borderColor: COLORS.primary,
  },
  bookBtn: {
    width: 44, alignItems: "center", justifyContent: "center",
    borderRadius: RADIUS.sm, borderWidth: 0.5, borderColor: COLORS.coral,
  },
  editBtn: {
    marginTop: 16, paddingHorizontal: 28, paddingVertical: 10,
    borderRadius: RADIUS.full, borderWidth: 0.5, borderColor: COLORS.border,
  },
  section: { padding: 16, borderTopWidth: 0.5, borderTopColor: COLORS.border },
  bio: { fontSize: 14, color: COLORS.textSecondary, lineHeight: 22 },
  sectionHeader: { paddingHorizontal: 16, paddingTop: 16, paddingBottom: 8 },
  sectionTitle: {
    fontSize: 11, color: COLORS.textTertiary, fontWeight: "700",
    letterSpacing: 0.8, textTransform: "uppercase",
  },
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 2, paddingHorizontal: 2 },
  gridCell: {
    width: "32.8%", aspectRatio: 1, alignItems: "center",
    justifyContent: "center", overflow: "hidden", borderRadius: 2,
  },
  emptyGrid: {
    padding: 30, color: COLORS.textTertiary, fontSize: 13, textAlign: "center", width: "100%",
  },
});

// ─────────────────────────────────────────────────────────────────────────────
// CHAT SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export function ChatScreen() {
  const router = useRouter();
  const { userId } = useLocalSearchParams<{ userId: string }>();
  const { user: me } = useAuthStore();
  const qc = useQueryClient();
  const [input, setInput] = useState("");
  const listRef = useRef<FlatList>(null);

  const { data: partner } = useQuery({
    queryKey: ["profile", userId],
    queryFn: () =>
      api.get(`/users/${userId}`).then((r) => r.data?.data ?? r.data),
    enabled: !!userId,
  });

  const { data: msgs } = useQuery({
    queryKey: ["messages", userId],
    queryFn: () =>
      api.get(`/messages/${userId}`).then((r) => r.data?.data ?? r.data ?? []),
    refetchInterval: 5000,
    enabled: !!userId,
  });

  useEffect(() => {
    const socket = getSocket();
    if (!socket) return;
    const handler = () => qc.invalidateQueries({ queryKey: ["messages", userId] });
    socket.on("new_message", handler);
    return () => { socket.off("new_message", handler); };
  }, [userId, qc]);

  const send = () => {
    if (!input.trim()) return;
    getSocket()?.emit("send_message", { receiverId: userId, content: input.trim() });
    qc.invalidateQueries({ queryKey: ["messages", userId] });
    setInput("");
  };

  const messages: any[] = Array.isArray(msgs) ? msgs : [];

  return (
    <KeyboardAvoidingView
      style={chatSt.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
      keyboardVerticalOffset={90}
    >
      {/* Header */}
      <View style={chatSt.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Avatar user={partner} size={34} />
        <View style={{ flex: 1 }}>
          <Text style={chatSt.partnerName}>{partner?.fullName ?? "..."}</Text>
          <Text style={chatSt.onlineStatus}>● online</Text>
        </View>
        <TouchableOpacity onPress={() => router.push(`/profile/${userId}`)}>
          <Ionicons name="person-outline" size={20} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item }: { item: any }) => {
          const isMe = item.sender?.id === me?.id;
          return (
            <View style={[chatSt.bubbleWrap, isMe && { alignItems: "flex-end" }]}>
              {isMe ? (
                <LinearGradient
                  colors={["#9F7AEA", "#7C5CFC"]}
                  style={[chatSt.bubble, chatSt.bubbleMe]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 0 }}
                >
                  <Text style={{ color: "#fff", fontSize: 14, lineHeight: 20 }}>
                    {item.content}
                  </Text>
                </LinearGradient>
              ) : (
                <View style={[chatSt.bubble, chatSt.bubbleThem]}>
                  <Text style={{ color: COLORS.text, fontSize: 14, lineHeight: 20 }}>
                    {item.content}
                  </Text>
                </View>
              )}
            </View>
          );
        }}
        contentContainerStyle={{ padding: 14, gap: 6, paddingBottom: 20 }}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        showsVerticalScrollIndicator={false}
      />

      <View style={chatSt.inputRow}>
        <TextInput
          style={chatSt.input}
          value={input}
          onChangeText={setInput}
          placeholder="type a message…"
          placeholderTextColor={COLORS.textTertiary}
          multiline
          returnKeyType="send"
          onSubmitEditing={send}
        />
        <TouchableOpacity style={chatSt.sendBtn} onPress={send}>
          <LinearGradient
            colors={["#9F7AEA", "#7C5CFC"]}
            style={chatSt.sendGrad}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
          >
            <Ionicons name="send" size={16} color="#fff" />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
}

const chatSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingTop: 54, paddingBottom: 12,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  partnerName: { fontSize: 15, fontWeight: "700", color: COLORS.text },
  onlineStatus: { fontSize: 11, color: COLORS.success, marginTop: 1 },
  bubbleWrap: { alignItems: "flex-start" },
  bubble: { maxWidth: "75%", paddingHorizontal: 14, paddingVertical: 10, borderRadius: 18 },
  bubbleMe: { borderBottomRightRadius: 4 },
  bubbleThem: { backgroundColor: COLORS.bgCard, borderBottomLeftRadius: 4 },
  inputRow: {
    flexDirection: "row", alignItems: "flex-end", gap: 8,
    padding: 12, borderTopWidth: 0.5, borderTopColor: COLORS.border,
  },
  input: {
    flex: 1, backgroundColor: COLORS.bgCard, borderRadius: 22,
    paddingHorizontal: 16, paddingVertical: 10,
    fontSize: 14, color: COLORS.text, maxHeight: 100,
  },
  sendBtn: { width: 40, height: 40, borderRadius: 20, overflow: "hidden" },
  sendGrad: { flex: 1, alignItems: "center", justifyContent: "center" },
});

// ─────────────────────────────────────────────────────────────────────────────
// LOGIN SCREEN
// ─────────────────────────────────────────────────────────────────────────────
export function LoginScreen() {
  const router = useRouter();
  const { login } = useAuthStore();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showPass, setShowPass] = useState(false);

  const handleLogin = async () => {
    if (!email || !password) { setError("please enter email and password"); return; }
    setLoading(true);
    setError("");
    try {
      await login(email, password);
      router.replace("/(tabs)/feed");
    } catch (e: any) {
      setError(e?.response?.data?.message ?? "invalid credentials");
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      style={loginSt.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      <LinearGradient colors={["#0D0D0F", "#13111C"]} style={StyleSheet.absoluteFill} />
      <View style={loginSt.glow} />

      <View style={loginSt.inner}>
        <LinearGradient
          colors={["#9F7AEA", "#7C5CFC", "#5438D0"]}
          style={loginSt.logo}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 1 }}
        >
          <Text style={{ fontSize: 26, fontWeight: "800", color: "#fff" }}>K</Text>
        </LinearGradient>

        <Text style={loginSt.title}>welcome back</Text>
        <Text style={loginSt.sub}>sign in to your kinship account</Text>

        <View style={loginSt.form}>
          <View style={loginSt.inputWrap}>
            <Ionicons name="mail-outline" size={16} color={COLORS.textTertiary} />
            <TextInput
              style={loginSt.input}
              placeholder="email"
              placeholderTextColor={COLORS.textTertiary}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
          </View>

          <View style={loginSt.inputWrap}>
            <Ionicons name="lock-closed-outline" size={16} color={COLORS.textTertiary} />
            <TextInput
              style={loginSt.input}
              placeholder="password"
              placeholderTextColor={COLORS.textTertiary}
              value={password}
              onChangeText={setPassword}
              secureTextEntry={!showPass}
            />
            <TouchableOpacity onPress={() => setShowPass(!showPass)} style={{ padding: 4 }}>
              <Ionicons
                name={showPass ? "eye-off-outline" : "eye-outline"}
                size={16}
                color={COLORS.textTertiary}
              />
            </TouchableOpacity>
          </View>

          {error ? (
            <View style={loginSt.errorBox}>
              <Ionicons name="alert-circle-outline" size={14} color={COLORS.error} />
              <Text style={{ fontSize: 13, color: COLORS.error }}>{error}</Text>
            </View>
          ) : null}

          <TouchableOpacity
            style={[loginSt.btn, loading && { opacity: 0.7 }]}
            onPress={handleLogin}
            disabled={loading}
          >
            <LinearGradient
              colors={["#9F7AEA", "#7C5CFC"]}
              style={loginSt.btnGrad}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              {loading ? (
                <ActivityIndicator color="#fff" size="small" />
              ) : (
                <Text style={{ fontSize: 15, fontWeight: "700", color: "#fff" }}>sign in</Text>
              )}
            </LinearGradient>
          </TouchableOpacity>

          <TouchableOpacity
            style={loginSt.ghost}
            onPress={() => router.push("/(auth)/onboarding")}
          >
            <Text style={{ fontSize: 13, color: COLORS.textSecondary }}>
              no account?{" "}
              <Text style={{ color: COLORS.primary, fontWeight: "700" }}>join kinship</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </KeyboardAvoidingView>
  );
}

const loginSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  glow: {
    position: "absolute", width: 280, height: 280, borderRadius: 140,
    backgroundColor: COLORS.primaryGlow, top: -60, right: -60, opacity: 0.8,
  },
  inner: { flex: 1, padding: 28, justifyContent: "center" },
  logo: {
    width: 64, height: 64, borderRadius: 20,
    alignItems: "center", justifyContent: "center", marginBottom: 28,
  },
  title: { fontSize: 32, fontWeight: "800", color: COLORS.text, marginBottom: 6 },
  sub: { fontSize: 14, color: COLORS.textSecondary, marginBottom: 32 },
  form: { gap: 12 },
  inputWrap: {
    flexDirection: "row", alignItems: "center", gap: 10,
    backgroundColor: COLORS.bgCard, borderWidth: 0.5, borderColor: COLORS.border,
    borderRadius: RADIUS.md, paddingHorizontal: 14,
  },
  input: { flex: 1, fontSize: 14, color: COLORS.text, paddingVertical: 13 },
  errorBox: {
    flexDirection: "row", alignItems: "center", gap: 6,
    backgroundColor: COLORS.errorBg, borderRadius: RADIUS.sm, padding: 10,
  },
  btn: { borderRadius: RADIUS.full, overflow: "hidden" },
  btnGrad: { paddingVertical: 15, alignItems: "center" },
  ghost: { alignItems: "center", paddingVertical: 12 },
});

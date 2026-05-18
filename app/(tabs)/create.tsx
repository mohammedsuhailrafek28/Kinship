// app/(tabs)/create.tsx
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
  Image,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { Ionicons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import Toast from "react-native-toast-message";
import { api } from "../../src/lib/api";
import { useAuthStore } from "../../src/store/auth.store";
import { Avatar } from "../../src/components/Avatar";
import { COLORS, RADIUS } from "../../src/constants/theme";

const CATEGORIES = [
  { slug: "singing",     label: "singing",     icon: "musical-note-outline" },
  { slug: "dancing",     label: "dancing",     icon: "body-outline" },
  { slug: "cooking",     label: "cooking",     icon: "restaurant-outline" },
  { slug: "art",         label: "art",         icon: "brush-outline" },
  { slug: "photography", label: "photo",       icon: "camera-outline" },
  { slug: "comedy",      label: "comedy",      icon: "happy-outline" },
  { slug: "fitness",     label: "fitness",     icon: "barbell-outline" },
  { slug: "fashion",     label: "fashion",     icon: "shirt-outline" },
];

export default function CreatePost() {
  const router = useRouter();
  const { user } = useAuthStore();
  const qc = useQueryClient();

  const [content, setContent] = useState("");
  const [category, setCategory] = useState("");
  const [media, setMedia] = useState<{ uri: string; type: string } | null>(null);

  const create = useMutation({
    mutationFn: (body: any) => api.post("/feed", body).then((r) => r.data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ["feed"] });
      Toast.show({ type: "success", text1: "Posted! 🎉", text2: "Your talent is live." });
      router.replace("/(tabs)/feed");
    },
    onError: () => {
      Toast.show({ type: "error", text1: "Post failed", text2: "Please try again." });
    },
  });

  const pickMedia = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      quality: 0.85,
    });
    if (!result.canceled) {
      const asset = result.assets[0];
      setMedia({ uri: asset.uri, type: asset.type === "video" ? "video" : "image" });
    }
  };

  const handlePost = () => {
    if (!content.trim() && !media) {
      Toast.show({ type: "error", text1: "Nothing to post", text2: "Add text or media." });
      return;
    }
    create.mutate({
      content: content.trim() || undefined,
      talentCategory: category || undefined,
      mediaUrl: media?.uri,
      mediaType: media?.type,
    });
  };

  const canPost = (content.trim().length > 0 || !!media) && !create.isPending;

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : undefined}
    >
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.cancelText}>cancel</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>new post</Text>
        <TouchableOpacity
          style={[styles.postBtn, !canPost && { opacity: 0.4 }]}
          onPress={handlePost}
          disabled={!canPost}
        >
          {create.isPending ? (
            <ActivityIndicator size="small" color="#fff" style={styles.postBtnInner} />
          ) : (
            <LinearGradient
              colors={["#FF7452", "#FF6B52"]}
              style={styles.postBtnInner}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 0 }}
            >
              <Text style={styles.postBtnText}>post</Text>
            </LinearGradient>
          )}
        </TouchableOpacity>
      </View>

      <ScrollView
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Composer */}
        <View style={styles.composerRow}>
          <Avatar user={user} size={44} />
          <TextInput
            style={styles.textInput}
            placeholder="share your talent, a milestone, something you made…"
            placeholderTextColor={COLORS.textTertiary}
            value={content}
            onChangeText={setContent}
            multiline
            textAlignVertical="top"
            autoFocus
          />
        </View>

        {/* Media */}
        {media ? (
          <View style={styles.mediaPreview}>
            <Image source={{ uri: media.uri }} style={styles.mediaImage} resizeMode="cover" />
            {media.type === "video" && (
              <View style={styles.playOverlay}>
                <Ionicons name="play-circle" size={40} color="rgba(255,255,255,0.8)" />
              </View>
            )}
            <TouchableOpacity style={styles.removeMedia} onPress={() => setMedia(null)}>
              <Ionicons name="close-circle" size={24} color="#fff" />
            </TouchableOpacity>
          </View>
        ) : (
          <TouchableOpacity style={styles.mediaPicker} onPress={pickMedia}>
            <LinearGradient
              colors={["#1A1040", "#13111C"]}
              style={StyleSheet.absoluteFill}
              borderRadius={RADIUS.lg}
            />
            <Ionicons name="image-outline" size={32} color={COLORS.textTertiary} />
            <Text style={styles.mediaPickerText}>add photo or video</Text>
            <Text style={styles.mediaPickerSub}>showcase your talent visually</Text>
          </TouchableOpacity>
        )}

        {/* Category picker */}
        <Text style={styles.sectionLabel}>talent category</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ gap: 8, paddingVertical: 4 }}
        >
          {CATEGORIES.map((c) => (
            <TouchableOpacity
              key={c.slug}
              style={[styles.catChip, category === c.slug && styles.catChipActive]}
              onPress={() => setCategory(category === c.slug ? "" : c.slug)}
            >
              <Ionicons
                name={c.icon as any}
                size={13}
                color={category === c.slug ? COLORS.primary : COLORS.textSecondary}
              />
              <Text
                style={[styles.catChipText, category === c.slug && { color: COLORS.primary }]}
              >
                {c.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Tip */}
        <View style={styles.tipBox}>
          <Ionicons name="sparkles-outline" size={14} color={COLORS.gold} />
          <Text style={styles.tipText}>
            posts with videos get 3× more appreciations. show your process!
          </Text>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 54, paddingBottom: 14,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  cancelText: { fontSize: 14, color: COLORS.textSecondary },
  headerTitle: { fontSize: 16, fontWeight: "700", color: COLORS.text },
  postBtn: { borderRadius: RADIUS.full, overflow: "hidden" },
  postBtnInner: { paddingHorizontal: 20, paddingVertical: 8, alignItems: "center" },
  postBtnText: { fontSize: 14, fontWeight: "700", color: "#fff" },
  body: { padding: 16, gap: 20, paddingBottom: 100 },
  composerRow: { flexDirection: "row", gap: 12, alignItems: "flex-start" },
  textInput: {
    flex: 1, fontSize: 16, color: COLORS.text, lineHeight: 24, minHeight: 120,
  },
  mediaPreview: {
    width: "100%", height: 220, borderRadius: RADIUS.lg,
    overflow: "hidden", position: "relative",
  },
  mediaImage: { width: "100%", height: "100%" },
  playOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: "center", justifyContent: "center",
    backgroundColor: "rgba(0,0,0,0.3)",
  },
  removeMedia: { position: "absolute", top: 10, right: 10 },
  mediaPicker: {
    height: 140, borderRadius: RADIUS.lg, alignItems: "center",
    justifyContent: "center", gap: 8, overflow: "hidden",
    borderWidth: 0.5, borderColor: COLORS.border, borderStyle: "dashed",
  },
  mediaPickerText: { fontSize: 14, color: COLORS.textSecondary, fontWeight: "600" },
  mediaPickerSub: { fontSize: 12, color: COLORS.textTertiary },
  sectionLabel: {
    fontSize: 11, color: COLORS.textTertiary,
    fontWeight: "700", letterSpacing: 0.8, textTransform: "uppercase",
  },
  catChip: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 14, paddingVertical: 8, borderRadius: RADIUS.full,
    borderWidth: 0.5, borderColor: COLORS.border, backgroundColor: COLORS.bgCard,
  },
  catChipActive: { borderColor: COLORS.primary, backgroundColor: COLORS.primaryGlow },
  catChipText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "500" },
  tipBox: {
    flexDirection: "row", alignItems: "center", gap: 8,
    backgroundColor: COLORS.warningBg, borderRadius: RADIUS.sm, padding: 12,
  },
  tipText: { fontSize: 12, color: COLORS.gold, flex: 1, lineHeight: 18 },
});

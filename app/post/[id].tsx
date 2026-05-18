// app/post/[id].tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useQuery } from "@tanstack/react-query";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../../src/lib/api";
import { PostCard } from "../../src/components/PostCard";
import { Avatar } from "../../src/components/Avatar";
import { COLORS, RADIUS } from "../../src/constants/theme";

export default function PostDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const { data: post, isLoading } = useQuery({
    queryKey: ["post", id],
    queryFn: () =>
      api.get(`/feed/${id}`).then((r) => r.data?.data ?? r.data),
    enabled: !!id,
  });

  const { data: comments } = useQuery({
    queryKey: ["comments", id],
    queryFn: () =>
      api.get(`/feed/${id}/comments`).then((r) => r.data?.data ?? r.data ?? []),
    enabled: !!id,
  });

  const commentList: any[] = Array.isArray(comments) ? comments : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>post</Text>
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <ScrollView
          contentContainerStyle={{ paddingBottom: 100 }}
          showsVerticalScrollIndicator={false}
        >
          {post && (
            <PostCard
              post={post}
              onPress={() => {}}
              onUserPress={() => router.push(`/profile/${post.user?.id}`)}
            />
          )}

          <Text style={styles.commentsLabel}>comments</Text>

          {commentList.length === 0 ? (
            <Text style={styles.noComments}>no comments yet — be the first!</Text>
          ) : (
            commentList.map((c: any) => (
              <View key={c.id} style={styles.comment}>
                <Avatar user={c.user} size={32} />
                <View style={{ flex: 1, marginLeft: 10 }}>
                  <Text style={styles.commentName}>{c.user?.fullName}</Text>
                  <Text style={styles.commentText}>{c.content}</Text>
                </View>
              </View>
            ))
          )}
        </ScrollView>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row", alignItems: "center", gap: 12,
    paddingHorizontal: 16, paddingTop: 54, paddingBottom: 12,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  headerTitle: { fontSize: 17, fontWeight: "700", color: COLORS.text },
  commentsLabel: {
    fontSize: 11, color: COLORS.textTertiary, fontWeight: "700",
    letterSpacing: 0.8, textTransform: "uppercase",
    paddingHorizontal: 16, marginTop: 16, marginBottom: 12,
  },
  noComments: {
    textAlign: "center", color: COLORS.textTertiary,
    fontSize: 13, paddingTop: 20,
  },
  comment: {
    flexDirection: "row", paddingHorizontal: 16, marginBottom: 14,
  },
  commentName: { fontSize: 13, fontWeight: "700", color: COLORS.text },
  commentText: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginTop: 2 },
});

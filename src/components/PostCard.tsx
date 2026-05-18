// src/components/PostCard.tsx
import React, { useState } from "react";
import { View, Text, StyleSheet, TouchableOpacity, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { formatDistanceToNow } from "date-fns";
import { Avatar } from "./Avatar";
import { TalentBadge } from "./TalentBadge";
import { VerifyTick } from "./VerifyTick";
import { COLORS, RADIUS, SHADOW } from "../constants/theme";

interface Props {
  post: any;
  onLike?: () => void;
  onPress?: () => void;
  onUserPress?: () => void;
}

export function PostCard({ post, onLike, onPress, onUserPress }: Props) {
  const [liked, setLiked] = useState(false);
  const [count, setCount] = useState<number>(post?.likeCount ?? 0);

  const handleLike = () => {
    setLiked(!liked);
    setCount(liked ? count - 1 : count + 1);
    onLike?.();
  };

  return (
    <Pressable style={styles.card} onPress={onPress}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={onUserPress}>
          <Avatar user={post?.user} size={40} />
        </TouchableOpacity>
        <TouchableOpacity style={{ flex: 1, marginLeft: 10 }} onPress={onUserPress}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
            <Text style={styles.name} numberOfLines={1}>{post?.user?.fullName}</Text>
            {post?.user?.verified && <VerifyTick size={14} />}
          </View>
          <Text style={styles.meta}>
            {post?.createdAt
              ? formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })
              : ""}
          </Text>
        </TouchableOpacity>
        {post?.user?.skills?.[0] && (
          <TalentBadge skill={post.user.skills[0]} small />
        )}
      </View>

      {/* Media placeholder */}
      {post?.mediaUrl && (
        <View style={styles.media}>
          <LinearGradient
            colors={["#1a1a2e", "#16213e", "#0f3460"]}
            style={StyleSheet.absoluteFill}
          />
          <Ionicons
            name={post.mediaType === "video" ? "play-circle" : "image"}
            size={40}
            color="rgba(255,255,255,0.6)"
          />
        </View>
      )}

      {/* Content */}
      {post?.content ? (
        <Text style={styles.content} numberOfLines={3}>{post.content}</Text>
      ) : null}

      {/* Actions */}
      <View style={styles.actions}>
        <TouchableOpacity style={styles.actionBtn} onPress={handleLike}>
          <Ionicons
            name={liked ? "heart" : "heart-outline"}
            size={18}
            color={liked ? COLORS.coral : COLORS.textSecondary}
          />
          <Text style={[styles.actionText, liked && { color: COLORS.coral }]}>{count}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn} onPress={onPress}>
          <Ionicons name="chatbubble-outline" size={16} color={COLORS.textSecondary} />
          <Text style={styles.actionText}>{post?.commentCount ?? 0}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.actionBtn}>
          <Ionicons name="share-social-outline" size={18} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: COLORS.bgCard,
    borderRadius: RADIUS.lg,
    borderWidth: 0.5,
    borderColor: COLORS.border,
    marginHorizontal: 16,
    marginBottom: 12,
    overflow: "hidden",
    ...SHADOW.card,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 14,
    paddingBottom: 10,
  },
  name: { fontSize: 14, fontWeight: "600", color: COLORS.text },
  meta: { fontSize: 11, color: COLORS.textTertiary, marginTop: 1 },
  media: {
    height: 200,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    fontSize: 14,
    color: COLORS.textSecondary,
    lineHeight: 21,
    paddingHorizontal: 14,
    paddingBottom: 10,
  },
  actions: {
    flexDirection: "row",
    gap: 6,
    paddingHorizontal: 14,
    paddingBottom: 12,
  },
  actionBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    backgroundColor: COLORS.bgElevated,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: RADIUS.full,
  },
  actionText: { fontSize: 12, color: COLORS.textSecondary },
});

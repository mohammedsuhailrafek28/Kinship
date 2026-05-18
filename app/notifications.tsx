// app/notifications.tsx
import React from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { api } from "../src/lib/api";
import { COLORS, RADIUS } from "../src/constants/theme";

const NOTIF_ICONS: Record<string, { icon: string; color: string; bg: string }> = {
  like:                { icon: "heart",               color: "#FF6B8A", bg: "#2E1020" },
  comment:             { icon: "chatbubble",           color: COLORS.primary, bg: "#1E1640" },
  connection_request:  { icon: "person-add",           color: COLORS.success, bg: COLORS.successBg },
  connection_accepted: { icon: "people",               color: COLORS.success, bg: COLORS.successBg },
  message:             { icon: "chatbubble-ellipses",  color: COLORS.primary, bg: "#1E1640" },
  opportunity_match:   { icon: "briefcase",            color: COLORS.gold,    bg: COLORS.warningBg },
  collab_invite:       { icon: "git-merge",            color: COLORS.primary, bg: "#1E1640" },
  application_update:  { icon: "checkmark-circle",     color: COLORS.success, bg: COLORS.successBg },
  new_review:          { icon: "star",                 color: COLORS.gold,    bg: COLORS.warningBg },
  ai_suggestion:       { icon: "sparkles",             color: COLORS.gold,    bg: COLORS.warningBg },
  payment_received:    { icon: "cash",                 color: COLORS.success, bg: COLORS.successBg },
};

const DEFAULT_ICON = { icon: "notifications", color: COLORS.primary, bg: "#1E1640" };

export default function NotificationsPage() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () =>
      api.get("/notifications?limit=50").then((r) => r.data?.data ?? r.data ?? []),
  });

  const markAllRead = useMutation({
    mutationFn: () => api.put("/notifications/read-all"),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const markRead = useMutation({
    mutationFn: (id: string) => api.put(`/notifications/${id}/read`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["notifications"] }),
  });

  const notifs: any[] = data?.items ?? (Array.isArray(data) ? data : []);
  const unreadCount = notifs.filter((n: any) => !n.read).length;

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
        <Text style={styles.title}>notifications</Text>
        {unreadCount > 0 && (
          <TouchableOpacity
            onPress={() => markAllRead.mutate()}
            style={styles.markAllBtn}
            disabled={markAllRead.isPending}
          >
            <Text style={styles.markAllText}>mark all read</Text>
          </TouchableOpacity>
        )}
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={notifs}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }: { item: any }) => {
            const ic = NOTIF_ICONS[item.type] ?? DEFAULT_ICON;
            return (
              <TouchableOpacity
                style={[styles.row, !item.read && styles.rowUnread]}
                onPress={() => markRead.mutate(item.id)}
                activeOpacity={0.8}
              >
                <View style={[styles.iconWrap, { backgroundColor: ic.bg }]}> 
                  <Ionicons name={ic.icon as any} size={18} color={ic.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.notifTitle}>{item.title}</Text>
                  <Text style={styles.notifBody} numberOfLines={2}>{item.body}</Text>
                  <Text style={styles.notifTs}>
                    {item.createdAt
                      ? formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })
                      : ""}
                  </Text>
                </View>
                {!item.read && <View style={styles.dot} />}
              </TouchableOpacity>
            );
          }}
          contentContainerStyle={{ paddingBottom: 60 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="notifications-outline" size={44} color={COLORS.textTertiary} />
              <Text style={styles.emptyTitle}>you're all caught up</Text>
              <Text style={styles.emptySub}>new activity will appear here</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    paddingHorizontal: 16,
    paddingTop: 54,
    paddingBottom: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  backBtn: { padding: 4 },
  title: { flex: 1, fontSize: 22, fontWeight: "800", color: COLORS.text },
  markAllBtn: { paddingHorizontal: 10, paddingVertical: 5 },
  markAllText: { fontSize: 12, color: COLORS.primary, fontWeight: "600" },
  row: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderBottomWidth: 0.5,
    borderBottomColor: COLORS.border,
  },
  rowUnread: { backgroundColor: "#7C5CFC10" },
  iconWrap: {
    width: 42,
    height: 42,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  notifTitle: { fontSize: 14, fontWeight: "700", color: COLORS.text, marginBottom: 2 },
  notifBody: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 18 },
  notifTs: { fontSize: 11, color: COLORS.textTertiary, marginTop: 4 },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: COLORS.primary,
    marginTop: 6,
    flexShrink: 0,
  },
  empty: { alignItems: "center", paddingTop: 100, gap: 10 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: COLORS.textSecondary },
  emptySub: { fontSize: 13, color: COLORS.textTertiary },
});

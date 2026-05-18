// app/(tabs)/messages.tsx
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
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { formatDistanceToNow } from "date-fns";
import { api } from "../../src/lib/api";
import { Avatar } from "../../src/components/Avatar";
import { COLORS, RADIUS } from "../../src/constants/theme";

export default function Messages() {
  const router = useRouter();

  const { data, isLoading } = useQuery({
    queryKey: ["conversations"],
    queryFn: () =>
      api.get("/messages/conversations").then((r) => r.data?.data ?? r.data ?? []),
    refetchInterval: 8000,
  });

  const conversations: any[] = Array.isArray(data) ? data : [];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>messages</Text>
        <TouchableOpacity style={styles.composeBtn}>
          <Ionicons name="create-outline" size={22} color={COLORS.primary} />
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={conversations}
          keyExtractor={(item: any) => item.partner_id ?? item.id ?? String(Math.random())}
          renderItem={({ item }: { item: any }) => (
            <TouchableOpacity
              style={styles.row}
              onPress={() => router.push(`/chat/${item.partner_id}`)}
              activeOpacity={0.8}
            >
              <View>
                <Avatar
                  user={{ fullName: item.partner_name ?? "User", skills: [] }}
                  size={50}
                />
                {!item.read && <View style={styles.unreadDot} />}
              </View>
              <View style={{ flex: 1, marginLeft: 12 }}>
                <View style={styles.rowHeader}>
                  <Text style={styles.partnerName} numberOfLines={1}>
                    {item.partner_name ?? "user"}
                  </Text>
                  <Text style={styles.ts}>
                    {item.sent_at
                      ? formatDistanceToNow(new Date(item.sent_at), { addSuffix: false })
                      : ""}
                  </Text>
                </View>
                <Text style={styles.preview} numberOfLines={1}>{item.content}</Text>
              </View>
            </TouchableOpacity>
          )}
          contentContainerStyle={{ paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={styles.empty}>
              <Ionicons name="chatbubbles-outline" size={44} color={COLORS.textTertiary} />
              <Text style={styles.emptyTitle}>no messages yet</Text>
              <Text style={styles.emptySub}>
                connect with talent and start a conversation
              </Text>
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
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingTop: 58, paddingBottom: 14,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 22, fontWeight: "800", color: COLORS.text },
  composeBtn: {
    width: 40, height: 40, borderRadius: 12,
    backgroundColor: COLORS.primaryGlow,
    alignItems: "center", justifyContent: "center",
  },
  row: {
    flexDirection: "row", alignItems: "center",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  unreadDot: {
    position: "absolute", bottom: 0, right: 0,
    width: 12, height: 12, borderRadius: 6,
    backgroundColor: COLORS.primary,
    borderWidth: 2, borderColor: COLORS.bg,
  },
  rowHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 3 },
  partnerName: { fontSize: 14, fontWeight: "700", color: COLORS.text, flex: 1 },
  ts: { fontSize: 11, color: COLORS.textTertiary },
  preview: { fontSize: 13, color: COLORS.textSecondary },
  empty: { alignItems: "center", paddingTop: 100, gap: 10, paddingHorizontal: 40 },
  emptyTitle: { fontSize: 18, fontWeight: "700", color: COLORS.textSecondary },
  emptySub: { fontSize: 13, color: COLORS.textTertiary, textAlign: "center", lineHeight: 19 },
});

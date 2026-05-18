// src/screens/FeedScreen.tsx
import React, { useState } from "react";
import {
  View, Text, StyleSheet, FlatList, RefreshControl,
  ActivityIndicator, ScrollView, TextInput, TouchableOpacity,
} from "react-native";
import { useInfiniteQuery, useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { api } from "../lib/api";
import { PostCard } from "../components/PostCard";
import { TalentCard } from "../components/TalentCard";
import { OpportunityCard } from "../components/OpportunityCard";
import { SuggestRow } from "../components/SuggestRow";
import { Avatar } from "../components/Avatar";
import { TalentBadge } from "../components/TalentBadge";
import { VerifyTick } from "../components/VerifyTick";
import { COLORS, RADIUS, SHADOW } from "../constants/theme";

// ─────────────────────────────────────────────────────────────────────────────
// HOME FEED
// ─────────────────────────────────────────────────────────────────────────────
export function FeedScreen() {
  const router = useRouter();
  const qc = useQueryClient();

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, refetch, isRefetching } =
    useInfiniteQuery({
      queryKey: ["feed"],
      queryFn: ({ pageParam = 1 }) =>
        api.get(`/feed?page=${pageParam}&limit=15`).then((r) => r.data?.data ?? r.data),
      getNextPageParam: (last: any, pages) =>
        (last?.posts?.length ?? 0) === 15 ? pages.length + 1 : undefined,
      initialPageParam: 1,
    });

  const like = useMutation({
    mutationFn: (postId: string) => api.post(`/feed/${postId}/like`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["feed"] }),
  });

  const posts: any[] = data?.pages.flatMap((p: any) => p?.posts ?? p ?? []) ?? [];

  return (
    <View style={feedSt.container}>
      <View style={feedSt.topbar}>
        <View style={feedSt.logoMini}>
          <Text style={{ fontSize: 14, fontWeight: "800", color: "#fff" }}>K</Text>
        </View>
        <Text style={feedSt.topbarTitle}>kinship</Text>
        <View style={{ flex: 1 }} />
        <TouchableOpacity onPress={() => router.push("/notifications")} style={{ padding: 4 }}>
          <Ionicons name="notifications-outline" size={22} color={COLORS.textSecondary} />
        </TouchableOpacity>
      </View>

      <FlatList
        data={posts}
        keyExtractor={(item: any) => item.id}
        renderItem={({ item, index }) => (
          <>
            {index === 0 && <SuggestRow />}
            <PostCard
              post={item}
              onLike={() => like.mutate(item.id)}
              onPress={() => router.push(`/post/${item.id}`)}
              onUserPress={() => router.push(`/profile/${item.user?.id}`)}
            />
          </>
        )}
        refreshControl={
          <RefreshControl refreshing={isRefetching} onRefresh={refetch} tintColor={COLORS.primary} />
        }
        onEndReached={() => hasNextPage && fetchNextPage()}
        onEndReachedThreshold={0.5}
        ListFooterComponent={
          isFetchingNextPage
            ? <ActivityIndicator color={COLORS.primary} style={{ padding: 20 }} />
            : null
        }
        ListEmptyComponent={
          <View style={empty.wrap}>
            <Ionicons name="images-outline" size={40} color={COLORS.textTertiary} />
            <Text style={empty.text}>no posts yet — follow some talent!</Text>
          </View>
        }
        contentContainerStyle={{ paddingTop: 8, paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const feedSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  topbar: {
    flexDirection: "row", alignItems: "center", gap: 10,
    paddingHorizontal: 16, paddingTop: 54, paddingBottom: 12,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  logoMini: {
    width: 30, height: 30, borderRadius: 9,
    backgroundColor: COLORS.primary, alignItems: "center", justifyContent: "center",
  },
  topbarTitle: { fontSize: 18, fontWeight: "800", color: COLORS.text },
});

// ─────────────────────────────────────────────────────────────────────────────
// EXPLORE
// ─────────────────────────────────────────────────────────────────────────────
const CATS = [
  { slug: "all",         label: "all",     icon: "apps-outline" },
  { slug: "singing",     label: "singing", icon: "musical-note-outline" },
  { slug: "dancing",     label: "dancing", icon: "body-outline" },
  { slug: "cooking",     label: "cooking", icon: "restaurant-outline" },
  { slug: "art",         label: "art",     icon: "brush-outline" },
  { slug: "photography", label: "photo",   icon: "camera-outline" },
  { slug: "comedy",      label: "comedy",  icon: "happy-outline" },
  { slug: "fitness",     label: "fitness", icon: "barbell-outline" },
];

export function ExploreScreen() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [cat, setCat] = useState("all");

  const { data, isLoading } = useQuery({
    queryKey: ["search", q, cat],
    queryFn: () => {
      const p = new URLSearchParams();
      if (q) p.append("q", q);
      if (cat !== "all") p.append("category", cat);
      return api.get(`/search/talent?${p}`).then((r) => r.data?.data ?? r.data);
    },
  });

  const users: any[] = data?.users ?? (Array.isArray(data) ? data : []);

  return (
    <View style={explSt.container}>
      <View style={explSt.searchRow}>
        <Ionicons name="search-outline" size={18} color={COLORS.textTertiary} />
        <TextInput
          style={explSt.searchInput}
          placeholder="search talent, city, skill…"
          placeholderTextColor={COLORS.textTertiary}
          value={q}
          onChangeText={setQ}
        />
        {q ? (
          <TouchableOpacity onPress={() => setQ("")}>
            <Ionicons name="close-circle" size={18} color={COLORS.textTertiary} />
          </TouchableOpacity>
        ) : null}
      </View>

      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={explSt.catScroll}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {CATS.map((c) => (
          <TouchableOpacity
            key={c.slug}
            style={[explSt.catPill, cat === c.slug && explSt.catPillActive]}
            onPress={() => setCat(c.slug)}
          >
            <Ionicons
              name={c.icon as any}
              size={13}
              color={cat === c.slug ? COLORS.primary : COLORS.textSecondary}
            />
            <Text style={[explSt.catLabel, cat === c.slug && { color: COLORS.primary }]}>
              {c.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <TalentCard user={item} onPress={() => router.push(`/profile/${item.id}`)} />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={empty.wrap}>
              <Ionicons name="search-outline" size={36} color={COLORS.textTertiary} />
              <Text style={empty.text}>no talent found</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const explSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  searchRow: {
    flexDirection: "row", alignItems: "center", gap: 8, margin: 16,
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.full,
    borderWidth: 0.5, borderColor: COLORS.border,
    paddingHorizontal: 14, paddingVertical: 11,
  },
  searchInput: { flex: 1, fontSize: 14, color: COLORS.text },
  catScroll: { flexGrow: 0, marginBottom: 4 },
  catPill: {
    flexDirection: "row", alignItems: "center", gap: 5,
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 0.5, borderColor: COLORS.border,
  },
  catPillActive: { backgroundColor: "#7C5CFC20", borderColor: COLORS.primary },
  catLabel: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "500" },
});

// ─────────────────────────────────────────────────────────────────────────────
// GIGS
// ─────────────────────────────────────────────────────────────────────────────
const GIG_FILTERS = ["all", "singing", "dancing", "cooking", "art", "photography"];

export function GigsScreen() {
  const [filter, setFilter] = useState("all");
  const qc = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: ["gigs", filter],
    queryFn: () => {
      const qs = filter !== "all" ? `?talentType=${filter}` : "";
      return api
        .get(`/opportunities${qs}`)
        .then((r) => r.data?.data?.items ?? r.data?.items ?? r.data?.data ?? []);
    },
  });

  const apply = useMutation({
    mutationFn: (id: string) => api.post(`/opportunities/${id}/apply`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["gigs"] }),
  });

  const gigs: any[] = Array.isArray(data) ? data : [];

  return (
    <View style={gigSt.container}>
      <View style={gigSt.header}>
        <Text style={gigSt.title}>gig board</Text>
        <Ionicons name="filter-outline" size={20} color={COLORS.textSecondary} />
      </View>

      <ScrollView
        horizontal showsHorizontalScrollIndicator={false}
        style={gigSt.filters}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      >
        {GIG_FILTERS.map((f) => (
          <TouchableOpacity
            key={f}
            style={[gigSt.filter, filter === f && gigSt.filterActive]}
            onPress={() => setFilter(f)}
          >
            <Text style={[gigSt.filterText, filter === f && { color: COLORS.primary }]}>{f}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={gigs}
          keyExtractor={(item: any) => item.id}
          renderItem={({ item }) => (
            <OpportunityCard opp={item} onApply={() => apply.mutate(item.id)} />
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={empty.wrap}>
              <Ionicons name="briefcase-outline" size={36} color={COLORS.textTertiary} />
              <Text style={empty.text}>no gigs right now</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const gigSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  filters: { flexGrow: 0, paddingVertical: 12 },
  filter: {
    paddingHorizontal: 14, paddingVertical: 7,
    borderRadius: RADIUS.full, borderWidth: 0.5, borderColor: COLORS.border,
  },
  filterActive: { backgroundColor: "#7C5CFC20", borderColor: COLORS.primary },
  filterText: { fontSize: 12, color: COLORS.textSecondary, fontWeight: "500" },
});

// ─────────────────────────────────────────────────────────────────────────────
// COLLABS
// ─────────────────────────────────────────────────────────────────────────────
export function CollabsScreen() {
  const router = useRouter();
  const [invited, setInvited] = useState<Set<string>>(new Set());

  const { data, isLoading } = useQuery({
    queryKey: ["collab-suggested"],
    queryFn: () =>
      api.get("/collaborations/suggested").then((r) => r.data?.data ?? r.data ?? []),
  });

  const users: any[] = Array.isArray(data) ? data : [];

  return (
    <View style={collabSt.container}>
      <View style={collabSt.header}>
        <Text style={collabSt.title}>collaborations</Text>
        <TouchableOpacity style={collabSt.newBtn}>
          <Ionicons name="add" size={16} color={COLORS.primary} />
          <Text style={{ fontSize: 12, color: COLORS.primary, fontWeight: "600" }}>new</Text>
        </TouchableOpacity>
      </View>

      {isLoading ? (
        <ActivityIndicator color={COLORS.primary} style={{ marginTop: 40 }} />
      ) : (
        <FlatList
          data={users}
          keyExtractor={(item: any) => item.id}
          ListHeaderComponent={
            <Text style={collabSt.sectionLabel}>suggested for you</Text>
          }
          renderItem={({ item }) => (
            <View style={collabSt.card}>
              <View style={collabSt.cardTop}>
                <Avatar user={item} size={48} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                    <Text style={collabSt.name}>{item.fullName}</Text>
                    {item.verified && <VerifyTick size={14} />}
                  </View>
                  <Text style={collabSt.meta}>{item.city}</Text>
                </View>
                <View style={collabSt.matchBadge}>
                  <Text style={collabSt.matchText}>
                    {Math.floor(80 + Math.random() * 18)}% match
                  </Text>
                </View>
              </View>

              <View style={{ flexDirection: "row", gap: 6, flexWrap: "wrap", marginBottom: 10 }}>
                {item.skills?.slice(0, 2).map((s: any) => (
                  <TalentBadge key={s.id} skill={s} small />
                ))}
                {item.available && (
                  <View style={collabSt.openBadge}>
                    <Text style={{ fontSize: 9, color: COLORS.success, fontWeight: "700" }}>OPEN</Text>
                  </View>
                )}
              </View>

              {item.bio ? (
                <Text style={collabSt.bio} numberOfLines={2}>{item.bio}</Text>
              ) : null}

              <View style={collabSt.actions}>
                <TouchableOpacity
                  style={collabSt.msgBtn}
                  onPress={() => router.push(`/chat/${item.id}`)}
                >
                  <Ionicons name="chatbubble-outline" size={14} color={COLORS.text} />
                  <Text style={{ fontSize: 12, color: COLORS.text }}>message</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    collabSt.invBtn,
                    invited.has(item.id) && collabSt.invBtnDone,
                  ]}
                  onPress={() => setInvited((p) => new Set([...p, item.id]))}
                >
                  <Text style={{
                    fontSize: 12, fontWeight: "700",
                    color: invited.has(item.id) ? COLORS.success : "#fff",
                  }}>
                    {invited.has(item.id) ? "invited ✓" : "invite"}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
          contentContainerStyle={{ padding: 16, paddingBottom: 100 }}
          ListEmptyComponent={
            <View style={empty.wrap}>
              <Ionicons name="people-outline" size={36} color={COLORS.textTertiary} />
              <Text style={empty.text}>complete your profile to get matches</Text>
            </View>
          }
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}

const collabSt = StyleSheet.create({
  container: { flex: 1, backgroundColor: COLORS.bg },
  header: {
    flexDirection: "row", alignItems: "center", justifyContent: "space-between",
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 0.5, borderBottomColor: COLORS.border,
  },
  title: { fontSize: 20, fontWeight: "800", color: COLORS.text },
  newBtn: {
    flexDirection: "row", alignItems: "center", gap: 4,
    paddingHorizontal: 12, paddingVertical: 6,
    borderRadius: RADIUS.full, borderWidth: 0.5, borderColor: COLORS.primary,
  },
  sectionLabel: {
    fontSize: 11, color: COLORS.textTertiary, fontWeight: "700",
    letterSpacing: 0.8, textTransform: "uppercase", marginBottom: 12,
  },
  card: {
    backgroundColor: COLORS.bgCard, borderRadius: RADIUS.lg,
    borderWidth: 0.5, borderColor: COLORS.border,
    padding: 16, marginBottom: 12, ...SHADOW.card,
  },
  cardTop: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  name: { fontSize: 14, fontWeight: "700", color: COLORS.text },
  meta: { fontSize: 12, color: COLORS.textSecondary, marginTop: 2 },
  matchBadge: {
    paddingHorizontal: 8, paddingVertical: 4, borderRadius: RADIUS.full,
    backgroundColor: "#7C5CFC20", borderWidth: 0.5, borderColor: "#7C5CFC40",
  },
  matchText: { fontSize: 11, color: COLORS.primary, fontWeight: "600" },
  openBadge: {
    paddingHorizontal: 7, paddingVertical: 3,
    borderRadius: RADIUS.full, backgroundColor: COLORS.successBg,
  },
  bio: { fontSize: 13, color: COLORS.textSecondary, lineHeight: 19, marginBottom: 12 },
  actions: { flexDirection: "row", gap: 8 },
  msgBtn: {
    flex: 1, flexDirection: "row", alignItems: "center", justifyContent: "center",
    gap: 5, paddingVertical: 10, borderRadius: RADIUS.sm,
    borderWidth: 0.5, borderColor: COLORS.border,
  },
  invBtn: {
    flex: 1, alignItems: "center", justifyContent: "center",
    paddingVertical: 10, borderRadius: RADIUS.sm, backgroundColor: COLORS.primary,
  },
  invBtnDone: { backgroundColor: COLORS.successBg },
});

// ─────────────────────────────────────────────────────────────────────────────
// Shared empty state
// ─────────────────────────────────────────────────────────────────────────────
const empty = StyleSheet.create({
  wrap: { alignItems: "center", paddingTop: 80, gap: 12 },
  text: { fontSize: 14, color: COLORS.textTertiary },
});

// app/(tabs)/_layout.tsx
import React from "react";
import { Tabs } from "expo-router";
import { View, StyleSheet, Platform } from "react-native";
import { BlurView } from "expo-blur";
import { Ionicons } from "@expo/vector-icons";
import { COLORS } from "../../src/constants/theme";

function TabIcon({ name, focused }: { name: string; focused: boolean }) {
  return (
    <View style={[styles.iconWrap, focused && styles.iconWrapActive]}>
      <Ionicons
        name={name as any}
        size={22}
        color={focused ? COLORS.primary : COLORS.textTertiary}
      />
    </View>
  );
}

export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarActiveTintColor: COLORS.primary,
        tabBarInactiveTintColor: COLORS.textTertiary,
        tabBarStyle: {
          position: "absolute",
          backgroundColor: Platform.OS === "ios" ? "transparent" : COLORS.bgSheet,
          borderTopWidth: 0.5,
          borderTopColor: COLORS.border,
          height: 80,
          paddingBottom: Platform.OS === "ios" ? 20 : 10,
          paddingTop: 8,
          elevation: 0,
        },
        tabBarBackground: () =>
          Platform.OS === "ios" ? (
            <BlurView intensity={80} tint="dark" style={StyleSheet.absoluteFill} />
          ) : null,
        tabBarLabelStyle: { fontSize: 10, fontWeight: "600" },
      }}
    >
      <Tabs.Screen
        name="feed"
        options={{
          title: "home",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "home" : "home-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: "explore",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "compass" : "compass-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: "post",
          tabBarIcon: ({ focused }) => (
            <View style={styles.postBtn}>
              <Ionicons name="add" size={26} color="#fff" />
            </View>
          ),
        }}
      />
      <Tabs.Screen
        name="gigs"
        options={{
          title: "gigs",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "briefcase" : "briefcase-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="collabs"
        options={{
          title: "collabs",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "people" : "people-outline"} focused={focused} />
          ),
        }}
      />
      <Tabs.Screen
        name="messages"
        options={{
          title: "messages",
          tabBarIcon: ({ focused }) => (
            <TabIcon
              name={focused ? "chatbubble" : "chatbubble-outline"}
              focused={focused}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: "profile",
          tabBarIcon: ({ focused }) => (
            <TabIcon name={focused ? "person" : "person-outline"} focused={focused} />
          ),
        }}
      />
    </Tabs>
  );
}

const styles = StyleSheet.create({
  iconWrap: {
    width: 44, height: 32, alignItems: "center",
    justifyContent: "center", borderRadius: 10,
  },
  iconWrapActive: { backgroundColor: COLORS.primaryGlow },
  postBtn: {
    width: 48, height: 48, borderRadius: 14,
    backgroundColor: COLORS.primary, alignItems: "center",
    justifyContent: "center", marginBottom: 8,
    shadowColor: COLORS.primary, shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.5, shadowRadius: 8, elevation: 8,
  },
});

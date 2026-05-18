import { reservations, type Reservation } from "@/data/reservations";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const STATUS_COLORS: Record<Reservation["status"], { bg: string; text: string; label: string }> = {
  upcoming:  { bg: "#EBF5FF", text: "#1E90FF", label: "Upcoming" },
  completed: { bg: "#E9FBF0", text: "#27AE60", label: "Completed" },
  cancelled: { bg: "#FEEFEF", text: "#E74C3C", label: "Cancelled" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { day: "2-digit", month: "short", year: "numeric" });
}

function ReservationCard({ item }: { item: Reservation }) {
  const status = STATUS_COLORS[item.status];
  return (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.85}
      onPress={() =>
        router.push({ pathname: "/reservation-detail", params: { id: item.id } })
      }
    >
      <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
      <View style={styles.cardBody}>
        <View style={styles.cardTop}>
          <Text style={styles.cardName} numberOfLines={1}>{item.destinationName}</Text>
          <View style={[styles.badge, { backgroundColor: status.bg }]}>
            <Text style={[styles.badgeText, { color: status.text }]}>{status.label}</Text>
          </View>
        </View>

        <View style={styles.locationRow}>
          <Ionicons name="location-outline" size={13} color="#888" />
          <Text style={styles.locationText}>{item.country}</Text>
        </View>

        <View style={styles.datesRow}>
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Check-in</Text>
            <Text style={styles.dateValue}>{formatDate(item.checkIn)}</Text>
          </View>
          <View style={styles.dateSeparator} />
          <View style={styles.dateBlock}>
            <Text style={styles.dateLabel}>Check-out</Text>
            <Text style={styles.dateValue}>{formatDate(item.checkOut)}</Text>
          </View>
        </View>

        <View style={styles.cardFooter}>
          <Text style={styles.price}>${item.price.toLocaleString()}</Text>
          <View style={styles.guestsRow}>
            <Ionicons name="people-outline" size={14} color="#888" />
            <Text style={styles.guestsText}>{item.guests} guests</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

export default function Reservations() {
  const [tab, setTab] = useState<"upcoming" | "past">("upcoming");

  const filtered = reservations.filter((r) =>
    tab === "upcoming" ? r.status === "upcoming" : r.status !== "upcoming"
  );

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Reservations</Text>
      </View>

      {/* Tabs */}
      <View style={styles.tabsWrapper}>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "upcoming" && styles.tabBtnActive]}
          onPress={() => setTab("upcoming")}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabLabel, tab === "upcoming" && styles.tabLabelActive]}>
            Upcoming
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabBtn, tab === "past" && styles.tabBtnActive]}
          onPress={() => setTab("past")}
          activeOpacity={0.8}
        >
          <Text style={[styles.tabLabel, tab === "past" && styles.tabLabelActive]}>
            Past
          </Text>
        </TouchableOpacity>
      </View>

      {/* List */}
      <FlatList
        data={filtered}
        keyExtractor={(r) => r.id}
        renderItem={({ item }) => <ReservationCard item={item} />}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Ionicons name="calendar-outline" size={64} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No reservations</Text>
            <Text style={styles.emptySub}>You have no {tab} trips yet.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  header: {
    paddingHorizontal: 20,
    paddingTop: 8,
    paddingBottom: 4,
  },
  pageTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xLarge,
    color: Colors.tintColor,
  },

  /* Tabs */
  tabsWrapper: {
    flexDirection: "row",
    marginHorizontal: 20,
    marginVertical: 14,
    backgroundColor: "#EBEBEB",
    borderRadius: 12,
    padding: 4,
  },
  tabBtn: {
    flex: 1,
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  tabBtnActive: {
    backgroundColor: Colors.white,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  tabLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.medium - 1,
    color: "#888",
  },
  tabLabelActive: {
    color: Colors.tintColor,
    fontFamily: Fonts.bold,
  },

  /* List */
  listContent: {
    paddingHorizontal: 20,
    paddingBottom: 24,
    gap: 16,
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  cardImage: {
    width: "100%",
    height: 150,
  },
  cardBody: {
    padding: 14,
    gap: 8,
  },
  cardTop: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.regular,
    color: Colors.tintColor,
    flex: 1,
    marginRight: 8,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
  },
  locationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  locationText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: "#888",
  },
  datesRow: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 10,
    padding: 10,
  },
  dateBlock: {
    flex: 1,
    alignItems: "center",
    gap: 2,
  },
  dateLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "#888",
  },
  dateValue: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
    color: Colors.tintColor,
  },
  dateSeparator: {
    width: 1,
    height: 28,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 8,
  },
  cardFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 2,
  },
  price: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.regular,
    color: Colors.primaryColor,
  },
  guestsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  guestsText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: "#888",
  },

  /* Empty */
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
  },
  emptyTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xLarge,
    color: "#BDBDBD",
  },
  emptySub: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: "#BDBDBD",
  },
});

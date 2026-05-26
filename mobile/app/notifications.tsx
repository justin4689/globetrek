import {
  notifications as allNotifications,
  NotificationItem,
  NotificationType,
} from "@/data/notifications";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

function groupByDay(
  items: NotificationItem[]
): { day: string; items: NotificationItem[] }[] {
  const map: Record<string, NotificationItem[]> = {};
  const order: string[] = [];
  for (const item of items) {
    if (!map[item.day]) {
      map[item.day] = [];
      order.push(item.day);
    }
    map[item.day].push(item);
  }
  return order.map((day) => ({ day, items: map[day] }));
}

function NotifIcon({ type }: { type: NotificationType }) {
  switch (type) {
    case "reservation_confirmed":
      return (
        <View style={[styles.iconCircle, { backgroundColor: "#4CAF50" }]}>
          <Ionicons name="checkmark" size={22} color="white" />
        </View>
      );
    case "reservation_cancelled":
      return (
        <View style={[styles.iconCircle, { backgroundColor: "#FDDEDE" }]}>
          <Ionicons name="warning-outline" size={20} color="#E74C3C" />
        </View>
      );
    case "payment_successful":
      return (
        <View style={[styles.iconCircle, { backgroundColor: "#4CAF50" }]}>
          <Ionicons name="card-outline" size={20} color="white" />
        </View>
      );
    case "payment_failed":
      return (
        <View style={[styles.iconCircle, { backgroundColor: "#FDDEDE" }]}>
          <Ionicons name="close-circle-outline" size={22} color="#E74C3C" />
        </View>
      );
    case "rate_booking":
      return (
        <View style={[styles.iconCircle, { backgroundColor: "#FFF9C4" }]}>
          <Ionicons name="star-outline" size={20} color="#F9A825" />
        </View>
      );
  }
}

function EmptyState() {
  return (
    <View style={styles.emptyContainer}>
      <View style={styles.emptyIllustration}>
        <View style={styles.emptyPhoneFrame}>
          <Ionicons
            name="notifications-outline"
            size={36}
            color={Colors.tintColor}
          />
          <View style={styles.emptyLineGroup}>
            {[0, 1, 2].map((i) => (
              <View key={i} style={styles.emptyLine}>
                <View style={styles.emptyLineFill} />
              </View>
            ))}
          </View>
          <View style={styles.emptyBubble}>
            <Ionicons
              name="chatbubble-ellipses"
              size={18}
              color={Colors.primaryColor}
            />
          </View>
        </View>
      </View>
      <Text style={styles.emptyTitle}>No notifications</Text>
      <Text style={styles.emptySubtitle}>
        stay informed with instant notifications about any updates or changes to
        your booking
      </Text>
    </View>
  );
}

export default function Notifications() {
  const groups = groupByDay(allNotifications);
  const isEmpty = allNotifications.length === 0;

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.tintColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification</Text>
        <View style={{ width: 38 }} />
      </View>

      {isEmpty ? (
        <EmptyState />
      ) : (
        <>
          <ScrollView
            showsVerticalScrollIndicator={false}
            contentContainerStyle={styles.scrollContent}
          >
            {groups.map(({ day, items }, gi) => (
              <View key={day} style={gi > 0 ? styles.groupGap : undefined}>
                <Text style={styles.dayLabel}>{day}</Text>
                {items.map((notif, idx) => (
                  <TouchableOpacity
                    key={notif.id}
                    style={[styles.notifRow, idx === 0 && gi === 0 && styles.notifRowHighlighted]}
                    activeOpacity={0.75}
                    onPress={() =>
                      router.push({
                        pathname: "/notification-detail",
                        params: { id: notif.id },
                      })
                    }
                  >
                    <NotifIcon type={notif.type} />
                    <View style={styles.notifText}>
                      <Text style={styles.notifTitle}>{notif.title}</Text>
                      <Text style={styles.notifSubtitle} numberOfLines={1}>
                        {notif.subtitle}
                      </Text>
                      <Text style={styles.notifTime}>{notif.time}</Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
            <View style={{ height: 100 }} />
          </ScrollView>

          <View style={styles.bottomBar}>
            <TouchableOpacity style={styles.prevBtn} activeOpacity={0.85}>
              <Text style={styles.prevBtnText}>See previous notifications</Text>
            </TouchableOpacity>
          </View>
        </>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.white,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  backBtn: {
    width: 38,
    height: 38,
    borderRadius: 19,
    justifyContent: "center",
    alignItems: "center",
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.large,
    color: Colors.tintColor,
  },

  /* Scroll */
  scrollContent: {
    paddingHorizontal: 0,
  },

  /* Group */
  groupGap: {
    marginTop: 12,
  },
  dayLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: "#888",
    paddingHorizontal: 20,
    paddingVertical: 8,
  },

  /* Notification row */
  notifRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 14,
    gap: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F2F2F2",
  },
  notifRowHighlighted: {
    backgroundColor: "#F5F5F5",
  },
  iconCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 0,
  },
  notifText: {
    flex: 1,
    gap: 2,
  },
  notifTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.tintColor,
  },
  notifSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: "#666",
  },
  notifTime: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: "#999",
    marginTop: 2,
  },

  /* Bottom bar */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 20,
    paddingBottom: 28,
    paddingTop: 12,
    backgroundColor: Colors.white,
  },
  prevBtn: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  prevBtnText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.white,
  },

  /* Empty state */
  emptyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
    gap: 16,
  },
  emptyIllustration: {
    marginBottom: 8,
  },
  emptyPhoneFrame: {
    width: 120,
    height: 180,
    borderRadius: 20,
    borderWidth: 3,
    borderColor: Colors.tintColor,
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
  },
  emptyLineGroup: {
    width: "100%",
    gap: 5,
  },
  emptyLine: {
    height: 8,
    backgroundColor: "#F0F0F0",
    borderRadius: 4,
    overflow: "hidden",
  },
  emptyLineFill: {
    width: "70%",
    height: "100%",
    backgroundColor: "#E0E0E0",
    borderRadius: 4,
  },
  emptyBubble: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#FFF3EE",
    alignItems: "center",
    justifyContent: "center",
  },
  emptyTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xLarge,
    color: Colors.tintColor,
  },
  emptySubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: "#888",
    textAlign: "center",
    lineHeight: 22,
  },
});

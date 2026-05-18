import { reservations, type Reservation } from "@/data/reservations";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import {
  Alert,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

const STATUS_CONFIG: Record<
  Reservation["status"],
  { bg: string; text: string; label: string; icon: string }
> = {
  upcoming:  { bg: "#EBF5FF", text: "#1E90FF", label: "Upcoming",  icon: "time-outline" },
  completed: { bg: "#E9FBF0", text: "#27AE60", label: "Completed", icon: "checkmark-circle-outline" },
  cancelled: { bg: "#FEEFEF", text: "#E74C3C", label: "Cancelled", icon: "close-circle-outline" },
};

function formatDate(dateStr: string) {
  const d = new Date(dateStr);
  return d.toLocaleDateString("en-US", { weekday: "short", day: "2-digit", month: "short", year: "numeric" });
}

function nights(checkIn: string, checkOut: string) {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.round((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / msPerDay);
}

function InfoRow({ icon, label, value }: { icon: string; label: string; value: string }) {
  return (
    <View style={styles.infoRow}>
      <View style={styles.infoIconWrapper}>
        <Ionicons name={icon as any} size={20} color={Colors.primaryColor} />
      </View>
      <View style={styles.infoTextBlock}>
        <Text style={styles.infoLabel}>{label}</Text>
        <Text style={styles.infoValue}>{value}</Text>
      </View>
    </View>
  );
}

export default function ReservationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const reservation = reservations.find((r) => r.id === id);

  if (!reservation) return null;

  const status = STATUS_CONFIG[reservation.status];
  const numNights = nights(reservation.checkIn, reservation.checkOut);
  const pricePerNight = Math.round(reservation.price / numNights);

  const handleCancel = () => {
    Alert.alert(
      "Cancel Reservation",
      "Are you sure you want to cancel this reservation? This action cannot be undone.",
      [
        { text: "Keep it", style: "cancel" },
        { text: "Cancel booking", style: "destructive", onPress: () => router.back() },
      ]
    );
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero */}
        <View style={{ height: 260 }}>
          <Image source={reservation.image} style={styles.hero} resizeMode="cover" />
          <View style={styles.heroOverlay} />
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 12 }]}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textColor} />
          </TouchableOpacity>
          <View style={styles.heroInfo}>
            <Text style={styles.heroName}>{reservation.destinationName}</Text>
            <View style={styles.heroLocation}>
              <Ionicons name="location" size={14} color={Colors.white} />
              <Text style={styles.heroCountry}>{reservation.country}</Text>
            </View>
          </View>
        </View>

        {/* Content */}
        <View style={styles.content}>
          {/* Booking ref + Status */}
          <View style={styles.refRow}>
            <View>
              <Text style={styles.refLabel}>Booking reference</Text>
              <Text style={styles.refValue}>{reservation.bookingRef}</Text>
            </View>
            <View style={[styles.statusBadge, { backgroundColor: status.bg }]}>
              <Ionicons name={status.icon as any} size={14} color={status.text} />
              <Text style={[styles.statusText, { color: status.text }]}>{status.label}</Text>
            </View>
          </View>

          <View style={styles.divider} />

          {/* Trip details */}
          <Text style={styles.sectionTitle}>Trip details</Text>
          <View style={styles.card}>
            <InfoRow
              icon="calendar-outline"
              label="Check-in"
              value={formatDate(reservation.checkIn)}
            />
            <View style={styles.cardDivider} />
            <InfoRow
              icon="calendar-outline"
              label="Check-out"
              value={formatDate(reservation.checkOut)}
            />
            <View style={styles.cardDivider} />
            <InfoRow
              icon="moon-outline"
              label="Duration"
              value={`${numNights} nights`}
            />
            <View style={styles.cardDivider} />
            <InfoRow
              icon="people-outline"
              label="Guests"
              value={`${reservation.guests} guests`}
            />
          </View>

          {/* Price breakdown */}
          <Text style={styles.sectionTitle}>Price breakdown</Text>
          <View style={styles.card}>
            <View style={styles.priceRow}>
              <Text style={styles.priceRowLabel}>${pricePerNight} × {numNights} nights</Text>
              <Text style={styles.priceRowValue}>${reservation.price.toLocaleString()}</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.priceRow}>
              <Text style={styles.priceRowLabel}>Service fee</Text>
              <Text style={styles.priceRowValue}>$0</Text>
            </View>
            <View style={styles.cardDivider} />
            <View style={styles.priceRow}>
              <Text style={[styles.priceRowLabel, styles.totalLabel]}>Total</Text>
              <Text style={[styles.priceRowValue, styles.totalValue]}>
                ${reservation.price.toLocaleString()}
              </Text>
            </View>
          </View>

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom bar */}
      {reservation.status === "upcoming" && (
        <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
          <TouchableOpacity
            style={styles.viewDestBtn}
            activeOpacity={0.85}
            onPress={() =>
              router.push({ pathname: "/destination/[id]", params: { id: reservation.destinationId } })
            }
          >
            <Text style={styles.viewDestText}>View destination</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.cancelBtn}
            activeOpacity={0.85}
            onPress={handleCancel}
          >
            <Text style={styles.cancelText}>Cancel</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },

  /* Hero */
  hero: {
    width,
    height: 260,
    position: "absolute",
  },
  heroOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  backBtn: {
    position: "absolute",
    left: 16,
    width: 38,
    height: 38,
    borderRadius: 19,
    backgroundColor: "rgba(255,255,255,0.9)",
    justifyContent: "center",
    alignItems: "center",
  },
  heroInfo: {
    position: "absolute",
    bottom: 20,
    left: 20,
    gap: 4,
  },
  heroName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xxLarge,
    color: Colors.white,
  },
  heroLocation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
  },
  heroCountry: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: Colors.white,
  },

  /* Content */
  content: {
    backgroundColor: "#F7F8FA",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 24,
  },
  refRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  refLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: "#888",
    marginBottom: 2,
  },
  refValue: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.regular,
    color: Colors.tintColor,
    letterSpacing: 0.5,
  },
  statusBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
  },
  divider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 20,
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.tintColor,
    marginBottom: 12,
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 2,
    overflow: "hidden",
  },
  cardDivider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 16,
  },
  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
    gap: 14,
  },
  infoIconWrapper: {
    width: 38,
    height: 38,
    borderRadius: 10,
    backgroundColor: "#FFF3EE",
    alignItems: "center",
    justifyContent: "center",
  },
  infoTextBlock: {
    flex: 1,
    gap: 2,
  },
  infoLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "#888",
  },
  infoValue: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium - 1,
    color: Colors.tintColor,
  },

  /* Price */
  priceRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  priceRowLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium - 1,
    color: Colors.textColor,
  },
  priceRowValue: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.medium - 1,
    color: Colors.textColor,
  },
  totalLabel: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.regular,
    color: Colors.tintColor,
  },
  totalValue: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.regular,
    color: Colors.primaryColor,
  },

  /* Bottom bar */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  viewDestBtn: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    paddingVertical: 16,
    borderRadius: 14,
    alignItems: "center",
  },
  viewDestText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.white,
  },
  cancelBtn: {
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E74C3C",
    alignItems: "center",
  },
  cancelText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: "#E74C3C",
  },
});

import { notifications } from "@/data/notifications";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import {
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function DateCard({
  checkIn,
  checkOut,
}: {
  checkIn: string;
  checkOut: string;
}) {
  return (
    <View style={styles.dateCard}>
      <View style={styles.dateRow}>
        <Text style={styles.dateLabel}>
          <Text style={styles.dateLabelBold}>check in</Text>
          {"  :  "}
          {checkIn}
        </Text>
        <Text style={styles.dateValue}>{checkIn}</Text>
      </View>
      <View style={styles.dateDivider} />
      <View style={styles.dateRow}>
        <Text style={styles.dateLabel}>
          <Text style={styles.dateLabelBold}>check out</Text>
          {"  :  "}
          {checkOut}
        </Text>
        <Text style={styles.dateValue}>{checkOut}</Text>
      </View>
    </View>
  );
}

export default function NotificationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const notif = notifications.find((n) => n.id === id);

  if (!notif) return null;

  const isConfirmed = notif.type === "reservation_confirmed";
  const isCancelled = notif.type === "reservation_cancelled";
  const isPaymentFailed = notif.type === "payment_failed";

  const isSuccess = isConfirmed;
  const showContactSupport = isCancelled || isPaymentFailed;

  return (
    <View style={styles.root}>
      {/* Header */}
      <View style={[styles.header, { paddingTop: insets.top + 8 }]}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => router.back()}
          activeOpacity={0.8}
        >
          <Ionicons name="arrow-back" size={24} color={Colors.tintColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Notification details</Text>
        <View style={{ width: 38 }} />
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + (showContactSupport ? 100 : 32) },
        ]}
      >
        {/* Status icon */}
        <View style={styles.iconWrapper}>
          <View
            style={[
              styles.bigCircle,
              { backgroundColor: isSuccess ? "#4CAF50" : "#FDDEDE" },
            ]}
          >
            {isSuccess ? (
              <Ionicons name="checkmark" size={52} color="white" />
            ) : (
              <Ionicons name="warning-outline" size={44} color="#E74C3C" />
            )}
          </View>
        </View>

        {/* Title */}
        <Text style={styles.statusTitle}>
          {isConfirmed
            ? "Reservation Confirmed"
            : isCancelled
            ? "Reservation Canceled"
            : isPaymentFailed
            ? "Payment Failed"
            : notif.title}
        </Text>

        {/* Subtitle */}
        <Text style={styles.statusSubtitle}>
          {isConfirmed && notif.destination
            ? `your reservation at ${notif.destination.toLowerCase()} is confirmed`
            : isCancelled && notif.destination
            ? `your reservation at ${notif.destination.toLowerCase()} has been canceled`
            : isPaymentFailed && notif.amount
            ? `We were unable to process your payment of $${notif.amount}`
            : notif.subtitle}
        </Text>

        <View style={styles.divider} />

        {/* Payment Failed: show amount */}
        {isPaymentFailed && notif.amount !== undefined && (
          <>
            <Text style={styles.amountText}>${notif.amount}</Text>
            <View style={styles.divider} />
          </>
        )}

        {/* Reason section (cancelled + payment failed) */}
        {(isCancelled || isPaymentFailed) && (
          <>
            <Text style={styles.sectionTitle}>Reason</Text>
            {notif.reason && (
              <Text style={styles.reasonText}>{notif.reason}</Text>
            )}
            {isPaymentFailed && notif.detailReason && (
              <Text style={[styles.reasonText, { marginTop: 12 }]}>
                {notif.detailReason}
              </Text>
            )}
          </>
        )}

        {/* Reservation Details (confirmed + cancelled) */}
        {(isConfirmed || isCancelled) &&
          notif.checkIn &&
          notif.checkOut && (
            <>
              {isConfirmed && (
                <Text style={styles.sectionTitle}>Reservation Details</Text>
              )}
              {isCancelled && <View style={{ height: 20 }} />}
              <DateCard checkIn={notif.checkIn} checkOut={notif.checkOut} />
            </>
          )}
      </ScrollView>

      {/* Contact support button */}
      {showContactSupport && (
        <View
          style={[
            styles.bottomBar,
            { paddingBottom: insets.bottom + 12 },
          ]}
        >
          <TouchableOpacity
            style={styles.supportBtn}
            activeOpacity={0.85}
            onPress={() => router.push("/help-support")}
          >
            <Text style={styles.supportBtnText}>Contact support</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
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
    paddingBottom: 12,
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
    alignItems: "center",
    paddingHorizontal: 24,
    paddingTop: 24,
  },

  /* Icon */
  iconWrapper: {
    marginBottom: 20,
  },
  bigCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    justifyContent: "center",
    alignItems: "center",
  },

  /* Texts */
  statusTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.large,
    color: Colors.tintColor,
    textAlign: "center",
    marginBottom: 10,
  },
  statusSubtitle: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: "#5B9BD5",
    textAlign: "center",
    lineHeight: 22,
  },

  divider: {
    width: "100%",
    height: 1,
    backgroundColor: "#E8E8E8",
    marginVertical: 20,
  },

  /* Amount (payment failed) */
  amountText: {
    fontFamily: Fonts.bold,
    fontSize: 36,
    color: Colors.tintColor,
    textAlign: "center",
    marginVertical: 4,
  },

  /* Section title */
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.regular,
    color: Colors.tintColor,
    alignSelf: "flex-start",
    marginBottom: 12,
  },

  /* Reason */
  reasonText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: "#555",
    alignSelf: "flex-start",
    lineHeight: 22,
  },

  /* Date card */
  dateCard: {
    width: "100%",
    backgroundColor: "#F7F8FA",
    borderRadius: 14,
    overflow: "hidden",
  },
  dateRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 16,
  },
  dateLabel: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: "#444",
  },
  dateLabelBold: {
    fontFamily: Fonts.bold,
    color: Colors.tintColor,
  },
  dateValue: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: "#444",
  },
  dateDivider: {
    height: 1,
    backgroundColor: "#E8E8E8",
    marginHorizontal: 16,
  },

  /* Bottom */
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 24,
    paddingTop: 12,
    backgroundColor: Colors.white,
  },
  supportBtn: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: "center",
  },
  supportBtnText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.white,
  },
});

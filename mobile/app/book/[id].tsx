import { useDestination } from "@/hooks/queries/useDestinationQueries";
import { reservationService } from "@/services/reservationService";
import { imageSource } from "@/utils/api";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import DateTimePicker, { DateTimePickerEvent } from "@react-native-community/datetimepicker";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";

const MAX_GUESTS = 10;
const DAY_MS = 24 * 60 * 60 * 1000;

const startOfDay = (d: Date) => new Date(d.getFullYear(), d.getMonth(), d.getDate());
const addDays = (d: Date, days: number) => new Date(d.getTime() + days * DAY_MS);
const nightsBetween = (a: Date, b: Date) => Math.round((startOfDay(b).getTime() - startOfDay(a).getTime()) / DAY_MS);
const formatDate = (d: Date) =>
  d.toLocaleDateString("en-US", { weekday: "short", day: "numeric", month: "short", year: "numeric" });
/** Date-only string, so the booked day does not shift with the timezone. */
const toApiDate = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;

export default function Book() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const queryClient = useQueryClient();
  const { data: destination, isPending, isError, refetch } = useDestination(id);

  const today = startOfDay(new Date());
  const [checkIn, setCheckIn] = useState(addDays(today, 1));
  const [checkOut, setCheckOut] = useState(addDays(today, 4));
  const [guests, setGuests] = useState(1);
  const [picker, setPicker] = useState<"checkIn" | "checkOut" | null>(null);

  const nights = nightsBetween(checkIn, checkOut);
  const total = destination ? destination.price * nights * guests : 0;

  const book = useMutation({
    mutationFn: () =>
      reservationService.create({
        destinationId: id!,
        checkIn: toApiDate(checkIn),
        checkOut: toApiDate(checkOut),
        guests,
      }),
    onSuccess: ({ reservation }) => {
      queryClient.invalidateQueries({ queryKey: ["reservations"] });
      router.replace({ pathname: "/reservation-detail", params: { id: reservation._id } });
    },
    onError: (err) =>
      Alert.alert("Booking failed", err instanceof Error ? err.message : "Please try again."),
  });

  const onDateChange = (event: DateTimePickerEvent, date?: Date) => {
    const field = picker;
    // Android shows a dialog: close it whatever the user picked
    if (Platform.OS === "android") setPicker(null);
    if (event.type !== "set" || !date || !field) return;

    const day = startOfDay(date);
    if (field === "checkIn") {
      setCheckIn(day);
      // Keep at least one night: push check-out if it is no longer after check-in
      if (nightsBetween(day, checkOut) < 1) setCheckOut(addDays(day, 1));
    } else {
      setCheckOut(day);
    }
  };

  if (!destination) {
    return (
      <SafeAreaView style={[styles.root, styles.stateScreen]}>
        {isPending ? (
          <ActivityIndicator color={Colors.primaryColor} />
        ) : (
          <>
            <Text style={styles.stateText}>Could not load this destination.</Text>
            {isError && (
              <TouchableOpacity onPress={() => refetch()}>
                <Text style={styles.linkText}>Retry</Text>
              </TouchableOpacity>
            )}
            <TouchableOpacity onPress={() => router.back()}>
              <Text style={styles.linkText}>Go back</Text>
            </TouchableOpacity>
          </>
        )}
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.root} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn} activeOpacity={0.8}>
          <Ionicons name="arrow-back" size={24} color={Colors.textColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Book your trip</Text>
        <View style={styles.backBtn} />
      </View>

      <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {/* Destination summary */}
        <View style={styles.summaryCard}>
          <Image source={imageSource(destination.images[0])} style={styles.summaryImage} />
          <View style={styles.summaryInfo}>
            <Text style={styles.summaryName} numberOfLines={1}>{destination.name}</Text>
            <View style={styles.row}>
              <Ionicons name="location" size={13} color={Colors.primaryColor} />
              <Text style={styles.summaryCountry}>{destination.country}</Text>
            </View>
            <Text style={styles.summaryPrice}>
              ${destination.price}
              <Text style={styles.summaryUnit}> / night / guest</Text>
            </Text>
          </View>
        </View>

        {/* Dates */}
        <Text style={styles.sectionTitle}>Dates</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.fieldRow} onPress={() => setPicker("checkIn")} activeOpacity={0.7}>
            <View style={styles.fieldIcon}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primaryColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Check-in</Text>
              <Text style={styles.fieldValue}>{formatDate(checkIn)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#bbb" />
          </TouchableOpacity>
          <View style={styles.divider} />
          <TouchableOpacity style={styles.fieldRow} onPress={() => setPicker("checkOut")} activeOpacity={0.7}>
            <View style={styles.fieldIcon}>
              <Ionicons name="calendar-outline" size={20} color={Colors.primaryColor} />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.fieldLabel}>Check-out</Text>
              <Text style={styles.fieldValue}>{formatDate(checkOut)}</Text>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#bbb" />
          </TouchableOpacity>
        </View>

        {picker && (
          <DateTimePicker
            value={picker === "checkIn" ? checkIn : checkOut}
            mode="date"
            display={Platform.OS === "ios" ? "inline" : "default"}
            minimumDate={picker === "checkIn" ? today : addDays(checkIn, 1)}
            onChange={onDateChange}
            accentColor={Colors.primaryColor}
          />
        )}
        {picker && Platform.OS === "ios" && (
          <TouchableOpacity style={styles.doneBtn} onPress={() => setPicker(null)}>
            <Text style={styles.linkText}>Done</Text>
          </TouchableOpacity>
        )}

        {/* Guests */}
        <Text style={styles.sectionTitle}>Guests</Text>
        <View style={[styles.card, styles.fieldRow]}>
          <View style={styles.fieldIcon}>
            <Ionicons name="people-outline" size={20} color={Colors.primaryColor} />
          </View>
          <Text style={[styles.fieldValue, { flex: 1 }]}>
            {guests} {guests > 1 ? "guests" : "guest"}
          </Text>
          <View style={styles.stepper}>
            <TouchableOpacity
              style={[styles.stepBtn, guests <= 1 && styles.stepBtnDisabled]}
              onPress={() => setGuests((g) => Math.max(1, g - 1))}
              disabled={guests <= 1}
              accessibilityLabel="Remove a guest"
            >
              <Ionicons name="remove" size={18} color={guests <= 1 ? "#ccc" : Colors.textColor} />
            </TouchableOpacity>
            <Text style={styles.stepValue}>{guests}</Text>
            <TouchableOpacity
              style={[styles.stepBtn, guests >= MAX_GUESTS && styles.stepBtnDisabled]}
              onPress={() => setGuests((g) => Math.min(MAX_GUESTS, g + 1))}
              disabled={guests >= MAX_GUESTS}
              accessibilityLabel="Add a guest"
            >
              <Ionicons name="add" size={18} color={guests >= MAX_GUESTS ? "#ccc" : Colors.textColor} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Price */}
        <Text style={styles.sectionTitle}>Price</Text>
        <View style={styles.card}>
          <View style={styles.priceRow}>
            <Text style={styles.priceLabel}>
              ${destination.price} × {nights} {nights > 1 ? "nights" : "night"} × {guests}{" "}
              {guests > 1 ? "guests" : "guest"}
            </Text>
            <Text style={styles.priceValue}>${total.toLocaleString()}</Text>
          </View>
          <View style={styles.divider} />
          <View style={styles.priceRow}>
            <Text style={[styles.priceLabel, styles.totalLabel]}>Total</Text>
            <Text style={[styles.priceValue, styles.totalValue]}>${total.toLocaleString()}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Confirm */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity
          style={[styles.confirmBtn, book.isPending && { opacity: 0.75 }]}
          onPress={() => book.mutate()}
          disabled={book.isPending}
          activeOpacity={0.85}
        >
          {book.isPending ? (
            <ActivityIndicator color={Colors.white} />
          ) : (
            <Text style={styles.confirmText}>Confirm booking · ${total.toLocaleString()}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: "#F7F8FA" },
  stateScreen: { alignItems: "center", justifyContent: "center", gap: 12 },
  stateText: { fontFamily: Fonts.regular, fontSize: 14, color: "#888" },
  linkText: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.primaryColor },

  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  backBtn: { width: 40, height: 40, justifyContent: "center", alignItems: "center" },
  headerTitle: { fontFamily: Fonts.bold, fontSize: FontSizes.medium, color: Colors.textColor },

  content: { paddingHorizontal: 20, paddingBottom: 32 },
  row: { flexDirection: "row", alignItems: "center", gap: 4 },

  summaryCard: {
    flexDirection: "row",
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: "hidden",
    marginTop: 8,
  },
  summaryImage: { width: 96, height: 96 },
  summaryInfo: { flex: 1, padding: 12, justifyContent: "space-between" },
  summaryName: { fontFamily: Fonts.bold, fontSize: 17, color: Colors.textColor },
  summaryCountry: { fontFamily: Fonts.regular, fontSize: 13, color: "#888" },
  summaryPrice: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.primaryColor },
  summaryUnit: { fontFamily: Fonts.regular, fontSize: 12, color: "#888" },

  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: 16,
    color: Colors.textColor,
    marginTop: 24,
    marginBottom: 10,
  },
  card: { backgroundColor: Colors.white, borderRadius: 16, paddingHorizontal: 16 },
  fieldRow: { flexDirection: "row", alignItems: "center", gap: 12, paddingVertical: 14 },
  fieldIcon: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: "#FFF3EC",
    justifyContent: "center",
    alignItems: "center",
  },
  fieldLabel: { fontFamily: Fonts.regular, fontSize: 12, color: "#888" },
  fieldValue: { fontFamily: Fonts.bold, fontSize: 15, color: Colors.textColor, marginTop: 2 },
  divider: { height: 1, backgroundColor: "#F0F0F0" },
  doneBtn: { alignSelf: "flex-end", padding: 8 },

  stepper: { flexDirection: "row", alignItems: "center", gap: 12 },
  stepBtn: {
    width: 34,
    height: 34,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#DDD",
    justifyContent: "center",
    alignItems: "center",
  },
  stepBtnDisabled: { borderColor: "#EEE" },
  stepValue: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.textColor, minWidth: 18, textAlign: "center" },

  priceRow: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 14 },
  priceLabel: { fontFamily: Fonts.regular, fontSize: 14, color: "#555", flexShrink: 1, marginRight: 8 },
  priceValue: { fontFamily: Fonts.medium, fontSize: 14, color: Colors.textColor },
  totalLabel: { fontFamily: Fonts.bold, color: Colors.textColor, fontSize: 16 },
  totalValue: { fontFamily: Fonts.bold, color: Colors.primaryColor, fontSize: 18 },

  bottomBar: {
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  confirmBtn: {
    height: 54,
    borderRadius: 14,
    backgroundColor: Colors.primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  confirmText: { fontFamily: Fonts.bold, fontSize: 16, color: Colors.white },
});

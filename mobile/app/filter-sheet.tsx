import {
  DEFAULT_FILTERS,
  PriceRange,
  SortOption,
  useFilters,
} from "@/context/FiltersContext";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const sortOptions: { id: SortOption; label: string; icon: string }[] = [
  { id: "popular", label: "Popular", icon: "flame-outline" },
  { id: "price_asc", label: "Price: Low to High", icon: "arrow-up-outline" },
  { id: "price_desc", label: "Price: High to Low", icon: "arrow-down-outline" },
  { id: "rating", label: "Top Rated", icon: "star-outline" },
];

const priceRanges: { id: PriceRange; label: string; sub: string }[] = [
  { id: "budget", label: "Budget", sub: "Up to $200" },
  { id: "mid", label: "Mid-range", sub: "$200 – $500" },
  { id: "luxury", label: "Luxury", sub: "$500+" },
];

const ratings = [
  { value: 4, label: "4.0+" },
  { value: 4.5, label: "4.5+" },
  { value: 5, label: "5.0" },
];

export default function FilterSheet() {
  const { filters, setFilters } = useFilters();
  // Edits stay local until "Apply filters"; closing the sheet discards them
  const [selectedSort, setSelectedSort] = useState<SortOption>(filters.sort);
  const [selectedPrice, setSelectedPrice] = useState<PriceRange | null>(filters.price);
  const [selectedRating, setSelectedRating] = useState<number | null>(filters.minRating);

  const handleReset = () => {
    setSelectedSort(DEFAULT_FILTERS.sort);
    setSelectedPrice(DEFAULT_FILTERS.price);
    setSelectedRating(DEFAULT_FILTERS.minRating);
  };

  const handleApply = () => {
    setFilters({ sort: selectedSort, price: selectedPrice, minRating: selectedRating });
    router.back();
  };

  return (
    <SafeAreaView style={styles.container} edges={["bottom"]}>
      {/* Handle bar */}
      <View style={styles.handle} />

      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.title}>Filter & Sort</Text>
        <TouchableOpacity onPress={() => router.back()} style={styles.closeBtn}>
          <Ionicons name="close" size={22} color={Colors.textColor} />
        </TouchableOpacity>
      </View>

      <ScrollView style={{ flex: 1 }} showsVerticalScrollIndicator={false} contentContainerStyle={styles.content}>
        {/* Sort by */}
        <Text style={styles.sectionLabel}>Sort by</Text>
        <View style={styles.optionGrid}>
          {sortOptions.map((opt) => (
            <TouchableOpacity
              key={opt.id}
              style={[styles.optionChip, selectedSort === opt.id && styles.optionChipActive]}
              onPress={() => setSelectedSort(opt.id)}
              activeOpacity={0.75}
            >
              <Ionicons
                name={opt.icon as any}
                size={16}
                color={selectedSort === opt.id ? "white" : Colors.textColor}
              />
              <Text
                style={[styles.optionLabel, selectedSort === opt.id && styles.optionLabelActive]}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Price range */}
        <Text style={styles.sectionLabel}>Price per night</Text>
        <View style={styles.optionRow}>
          {priceRanges.map((range) => (
            <TouchableOpacity
              key={range.id}
              style={[styles.priceChip, selectedPrice === range.id && styles.optionChipActive]}
              // Tap the selected range again to clear it
              onPress={() => setSelectedPrice((prev) => (prev === range.id ? null : range.id))}
              activeOpacity={0.75}
            >
              <Text
                style={[styles.optionLabel, selectedPrice === range.id && styles.optionLabelActive]}
              >
                {range.label}
              </Text>
              <Text
                style={[styles.priceSubLabel, selectedPrice === range.id && styles.optionLabelActive]}
              >
                {range.sub}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Minimum rating */}
        <Text style={styles.sectionLabel}>Minimum rating</Text>
        <View style={styles.optionRow}>
          {ratings.map((r) => (
            <TouchableOpacity
              key={r.label}
              style={[styles.ratingChip, selectedRating === r.value && styles.optionChipActive]}
              onPress={() => setSelectedRating((prev) => (prev === r.value ? null : r.value))}
              activeOpacity={0.75}
            >
              <Ionicons
                name="star"
                size={14}
                color={selectedRating === r.value ? "white" : Colors.primaryColor}
              />
              <Text
                style={[styles.optionLabel, selectedRating === r.value && styles.optionLabelActive]}
              >
                {r.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>

      {/* Footer buttons */}
      <View style={styles.footer}>
        <TouchableOpacity style={styles.resetBtn} onPress={handleReset} activeOpacity={0.8}>
          <Text style={styles.resetLabel}>Reset</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.applyBtn} onPress={handleApply} activeOpacity={0.8}>
          <Text style={styles.applyLabel}>Apply filters</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#D0D0D0",
    alignSelf: "center",
    marginTop: 12,
    marginBottom: 4,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  title: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.large,
    color: Colors.textColor,
  },
  closeBtn: {
    padding: 4,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 12,
    gap: 8,
  },
  sectionLabel: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
    marginTop: 12,
    marginBottom: 10,
  },
  optionGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 10,
  },
  optionRow: {
    flexDirection: "row",
    gap: 10,
  },
  optionChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 22,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
  },
  optionChipActive: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  optionLabel: {
    fontFamily: Fonts.medium,
    fontSize: 13,
    color: Colors.textColor,
  },
  optionLabelActive: {
    color: "white",
  },
  priceChip: {
    flex: 1,
    alignItems: "center",
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
    gap: 4,
  },
  priceSubLabel: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "#888",
  },
  ratingChip: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 5,
    paddingVertical: 12,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    backgroundColor: "#FAFAFA",
  },
  footer: {
    flexDirection: "row",
    gap: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
  },
  resetBtn: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 14,
    borderWidth: 1.5,
    borderColor: Colors.primaryColor,
    alignItems: "center",
  },
  resetLabel: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.primaryColor,
  },
  applyBtn: {
    flex: 2,
    paddingVertical: 14,
    borderRadius: 14,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
  },
  applyLabel: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: "white",
  },
});
import { formatPrice } from "@/utils/format";
import SearchModal from "@/components/SearchModal";
import { useAuth } from "@/context/AuthContext";
import { useFilters } from "@/context/FiltersContext";
import { useCategories, useDestinations, useFeaturedDestinations } from "@/hooks/queries/useDestinationQueries";
import { useFavoriteIds, useToggleFavorite } from "@/hooks/queries/useFavoriteQueries";
import { useUnreadNotificationsCount } from "@/hooks/queries/useNotificationQueries";
import { imageSource } from "@/utils/api";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import { summarize } from "@/utils/text";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 32 - 12) / 2;

export default function Home() {
  const { user } = useAuth();
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchVisible, setSearchVisible] = useState(false);

  const { data: categories = [] } = useCategories();
  const { filters, activeCount: activeFilters, resetFilters } = useFilters();
  const destinationsQuery = useDestinations({ category: activeCategory, filters });
  const destinations = destinationsQuery.data ?? [];
  const { data: recommended = [] } = useFeaturedDestinations();
  const { data: unreadCount = 0 } = useUnreadNotificationsCount();
  const favoriteIds = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();

  const onToggleFavorite = (id: string) =>
    toggleFavorite.mutate({ destinationId: id, isFavorite: favoriteIds.has(id) });

  const openDestination = (id: string) =>
    router.push({ pathname: "/destination/[id]" as any, params: { id } });

  const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "";

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
      />

      {/* The whole page scrolls, header included, so cards are never hidden under it */}
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.imageWrapper}>
            <Image
              source={imageSource(user?.avatar, require("../../assets/image/avatar.jpg"))}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
              Hi{" "}
              <Text
                style={{ fontFamily: Fonts.bold }}
              >
                {fullName}
              </Text>{" "}
              👋
            </Text>
            {!!user?.location && (
              <View style={styles.headerLocationContainer}>
                <Ionicons name="location" size={14} color="black" />
                <Text style={styles.headerLocation}>{user.location}</Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.bellWrapper}
            onPress={() => router.push("/notifications")}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={32} color="black" />
            {unreadCount > 0 && (
              <View style={styles.badge}>
                <Text style={styles.badgeText}>{unreadCount > 9 ? "9+" : unreadCount}</Text>
              </View>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.title}>Travelling Today ?</Text>

      {/* Search */}
      <TouchableOpacity
        style={styles.searchSection}
        onPress={() => setSearchVisible(true)}
        activeOpacity={1}
      >
        <Ionicons name="search" size={24} style={{ color: "black" }} />
        <TextInput
          style={styles.input}
          placeholder="Where do you want to go?"
          editable={false}
          pointerEvents="none"
        />
        <TouchableOpacity
          style={styles.optionsWrapper}
          onPress={() => router.push("/filter-sheet")}
          activeOpacity={0.8}
        >
          <Ionicons name="options" size={24} color="white" />
          {activeFilters > 0 && (
            <View style={styles.filterBadge}>
              <Text style={styles.filterBadgeText}>{activeFilters}</Text>
            </View>
          )}
        </TouchableOpacity>
      </TouchableOpacity>

        {/* Categories */}
        <Text style={styles.sectionTitle}>Categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          <TouchableOpacity
            style={[styles.categoryChip, activeCategory === null && styles.categoryChipActive]}
            onPress={() => setActiveCategory(null)}
            activeOpacity={0.75}
          >
            <MaterialCommunityIcons
              name="view-grid-outline"
              size={18}
              color={activeCategory === null ? "white" : Colors.textColor}
            />
            <Text style={[styles.categoryText, activeCategory === null && styles.categoryTextActive]}>
              All
            </Text>
          </TouchableOpacity>
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                activeCategory === cat.name && styles.categoryChipActive,
              ]}
              // Tap again on the active category to show every destination
              onPress={() => setActiveCategory((prev) => (prev === cat.name ? null : cat.name))}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons
                name={cat.icon as any}
                size={18}
                color={activeCategory === cat.name ? "white" : Colors.textColor}
              />
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat.name && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Destination cards grid */}
        {destinationsQuery.isPending ? (
          <View style={styles.stateBox}>
            <ActivityIndicator color={Colors.primaryColor} />
          </View>
        ) : destinationsQuery.isError ? (
          <TouchableOpacity style={styles.stateBox} onPress={() => destinationsQuery.refetch()}>
            <Text style={styles.stateText}>Could not load destinations.</Text>
            <Text style={styles.retryText}>Tap to retry</Text>
          </TouchableOpacity>
        ) : destinations.length === 0 ? (
          <View style={styles.stateBox}>
            <Text style={styles.stateText}>
              {activeFilters > 0
                ? "No destinations match your filters."
                : "No destinations in this category yet."}
            </Text>
            {activeFilters > 0 && (
              <TouchableOpacity onPress={resetFilters}>
                <Text style={styles.retryText}>Clear filters</Text>
              </TouchableOpacity>
            )}
          </View>
        ) : null}

        <View style={styles.destinationsGrid}>
          {destinations.map((dest) => (
            <TouchableOpacity
              key={dest._id}
              style={styles.destinationCard}
              onPress={() => openDestination(dest._id)}
              activeOpacity={0.95}
            >
              <View style={styles.destImageContainer}>
                <Image
                  source={imageSource(dest.images[0])}
                  style={styles.destinationImage}
                  resizeMode="cover"
                />
                <BlurView intensity={40} tint="dark" style={styles.priceTag}>
                  <Text style={styles.priceTagText}>{formatPrice(dest.price)}<Text style={styles.priceTagUnit}>/night</Text></Text>
                </BlurView>
                <TouchableOpacity
                  style={styles.heartButton}
                  onPress={() => onToggleFavorite(dest._id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={favoriteIds.has(dest._id) ? "heart" : "heart-outline"}
                    size={16}
                    color={Colors.primaryColor}
                  />
                </TouchableOpacity>

                <BlurView intensity={60} tint="light" style={styles.destInfo}>
                  <View style={styles.destNameRow}>
                    <Text style={styles.destName} numberOfLines={1}>
                      {dest.name}
                    </Text>
                    <View style={styles.ratingBadge}>
                      <Ionicons
                        name="star"
                        size={11}
                        color={Colors.primaryColor}
                      />
                      <Text style={styles.ratingText}>{dest.rating}</Text>
                    </View>
                  </View>
                  <View style={styles.destLocationRow}>
                    <Ionicons
                      name="location"
                      size={12}
                      color={Colors.primaryColor}
                    />
                    <Text style={styles.locationText} numberOfLines={1}>
                      {dest.country}
                    </Text>
                  </View>
                </BlurView>
              </View>
            </TouchableOpacity>
          ))}
        </View>

        {/* Recommended */}
        {recommended.length > 0 && (
          <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Recommended</Text>
        )}
        {recommended.map((item) => (
          <TouchableOpacity
            key={item._id}
            style={styles.recommendedCard}
            activeOpacity={0.9}
            onPress={() => openDestination(item._id)}
          >
            <Image
              source={imageSource(item.images[0])}
              style={styles.recommendedImage}
              resizeMode="cover"
            />
            <View style={styles.recommendedInfo}>
              <View style={styles.recommendedHeader}>
                <Text style={styles.recommendedName} numberOfLines={1}>
                  {item.name}
                </Text>
                <View style={styles.ratingBadge}>
                  <Ionicons name="star" size={11} color={Colors.primaryColor} />
                  <Text style={styles.ratingText}>{item.rating}</Text>
                </View>
              </View>
              <Text style={styles.recommendedDesc} numberOfLines={2}>
                {summarize(item.description)}
              </Text>
              <View style={styles.recommendedFooter}>
                <Text style={styles.recommendedPrice}>{formatPrice(item.price)}<Text style={styles.recommendedUnit}> / night</Text></Text>
                <View style={styles.detailsButton}>
                  <Text style={styles.detailsText}>details</Text>
                  <Ionicons name="eye-outline" size={13} color="white" />
                </View>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        <View style={{ height: 24 }} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingTop: 20,
  },
  // Side padding lives inside the scroll view so badges and shadows near the edges are not clipped
  scrollContent: {
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerLeft: {
    flexDirection: "row",
    gap: 10,
  },
  imageWrapper: {
    width: 54,
    height: 54,
    borderRadius: 27,
    overflow: "hidden",
  },
  headerTextContainer: {
    flexDirection: "column",
    gap: 5,
  },
  headerText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
  },
  headerLocationContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  headerLocation: {
    fontFamily: Fonts.regular,
    color: Colors.tintColor,
  },
  headerRight: {
    justifyContent: "center",
    alignItems: "center",
  },
  // Padding keeps the badge inside the bell's box: the scroll view clips anything that overflows
  bellWrapper: {
    position: "relative",
    padding: 4,
  },
  badge: {
    position: "absolute",
    top: 0,
    right: 0,
    backgroundColor: Colors.primaryColor,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 4,
    borderWidth: 1.5,
    borderColor: Colors.white,
    justifyContent: "center",
    alignItems: "center",
  },
  badgeText: {
    fontFamily: Fonts.regular,
    color: "white",
    fontSize: 10,
    fontWeight: "bold",
  },
  title: {
    fontFamily: Fonts.bold,
    fontWeight: "700",
    fontSize: FontSizes.xLarge,
    marginTop: 30,
  },
  searchSection: {
    flexDirection: "row",
    alignItems: "center",
    borderColor: Colors.textColor,
    borderWidth: 1,
    paddingLeft: 8,
    borderRadius: 10,
    marginTop: 20,
    height: 48,
  },
  input: {
    flex: 1,
    height: "100%",
    paddingHorizontal: 8,
    fontFamily: Fonts.regular,
  },
  filterBadge: {
    position: "absolute",
    top: 6,
    right: 6,
    minWidth: 16,
    height: 16,
    borderRadius: 8,
    paddingHorizontal: 3,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
  },
  filterBadgeText: {
    fontFamily: Fonts.bold,
    fontSize: 10,
    color: Colors.primaryColor,
  },
  optionsWrapper: {
    backgroundColor: Colors.primaryColor,
    height: "100%",
    paddingHorizontal: 12,
    borderBottomRightRadius: 10,
    borderTopRightRadius: 10,
    justifyContent: "center",
    alignItems: "center",
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.large,
    marginTop: 24,
    marginBottom: 14,
  },
  categoriesContent: {
    gap: 10,
    paddingVertical: 2,
  },
  categoryChip: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 9,
    borderRadius: 22,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "white",
  },
  categoryChipActive: {
    backgroundColor: Colors.primaryColor,
    borderColor: Colors.primaryColor,
  },
  categoryText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
    color: Colors.textColor,
  },
  categoryTextActive: {
    color: "white",
  },
  destinationsGrid: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 12,
    marginTop: 4,
  },
  destinationCard: {
    width: CARD_WIDTH,
    borderRadius: 16,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  destImageContainer: {
    width: "100%",
    height: 145,
    position: "relative",
  },
  destinationImage: {
    width: "100%",
    height: "100%",
  },
  priceTag: {
    position: "absolute",
    top: 8,
    left: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 8,
    overflow: "hidden",
  },
  priceTagUnit: {
    fontFamily: Fonts.regular,
    fontSize: 10,
    color: "white",
  },
  priceTagText: {
    color: "white",
    fontFamily: Fonts.bold,
    fontSize: FontSizes.small,
  },
  heartButton: {
    position: "absolute",
    top: 8,
    right: 8,
    backgroundColor: "rgba(255,255,255,0.75)",
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  },
  destInfo: {
    padding: 10,
    gap: 5,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.45)",

 

  },
  destNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  destName: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.textColor,
    flex: 1,
    marginRight: 4,
    textDecorationLine: "underline",
  },
  ratingBadge: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  ratingText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: Colors.textColor,
  },
  destLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  locationText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "#777",
  },
  stateBox: {
    paddingVertical: 32,
    alignItems: "center",
    gap: 6,
  },
  stateText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "#888",
  },
  retryText: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: Colors.primaryColor,
  },
  recommendedCard: {
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FCFCFC", // must be opaque: a translucent bg lets the Android elevation shadow show through
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
    elevation: 3,
  },
  recommendedImage: {
    width: 95,
    height: 105,
  },
  recommendedInfo: {
    flex: 1,
    padding: 10,
    justifyContent: "space-between",
  },
  recommendedHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendedName: {
    fontFamily: Fonts.bold,
    fontSize: 14,
    color: "black",
    textDecorationLine: "underline",
    flex: 1,
    marginRight: 6,
  },
  recommendedDesc: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "#888",
    lineHeight: 16,
  },
  recommendedFooter: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  recommendedUnit: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "#888",
  },
  recommendedPrice: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
  },
  detailsButton: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
    backgroundColor: Colors.primaryColor,
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
  },
  detailsText: {
    fontFamily: Fonts.medium,
    fontSize: 11,
    color: "white",
  },
});

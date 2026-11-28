import { DestinationGridSkeleton } from "@/components/Skeleton";
import { formatPrice } from "@/utils/format";
import { useFavorites, useToggleFavorite } from "@/hooks/queries/useFavoriteQueries";
import { imageSource } from "@/utils/api";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import {
  Dimensions,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 32 - 12) / 2;

export default function Favorites() {
  const { data: favorites = [], isPending, isError, refetch, isRefetching } = useFavorites();
  const toggleFavorite = useToggleFavorite();

  const favDestinations = favorites.map((f) => f.destination);

  const removeFavorite = (id: string) =>
    toggleFavorite.mutate({ destinationId: id, isFavorite: true });

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.pageTitle}>Favorites</Text>
        {favDestinations.length > 0 && (
          <Text style={styles.countText}>{favDestinations.length} saved</Text>
        )}
      </View>

      <FlatList
        key="favorites-2col"
        data={favDestinations}
        keyExtractor={(item) => item._id}
        onRefresh={refetch}
        refreshing={isRefetching}
        numColumns={2}
        columnWrapperStyle={styles.row}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.destinationCard}
            onPress={() =>
              router.push({ pathname: "/destination/[id]" as any, params: { id: item._id } })
            }
            activeOpacity={0.95}
          >
            <View style={styles.destImageContainer}>
              <Image
                source={imageSource(item.images[0])}
                style={styles.destinationImage}
                resizeMode="cover"
              />

              {/* Price tag */}
              <BlurView intensity={40} tint="dark" style={styles.priceTag}>
                <Text style={styles.priceTagText}>{formatPrice(item.price)}<Text style={styles.priceTagUnit}>/night</Text></Text>
              </BlurView>

              {/* Heart button — always filled, tap to remove */}
              <TouchableOpacity
                style={styles.heartButton}
                testID={`favorite-remove-${item.name}`}
                accessibilityLabel="Remove from favorites"
                onPress={() => removeFavorite(item._id)}
                activeOpacity={0.8}
              >
                <Ionicons name="heart" size={16} color={Colors.primaryColor} />
              </TouchableOpacity>

              {/* Destination info blur */}
              <BlurView intensity={60} tint="light" style={styles.destInfo}>
                <View style={styles.destNameRow}>
                  <Text style={styles.destName} numberOfLines={1}>
                    {item.name}
                  </Text>
                  <View style={styles.ratingBadge}>
                    <Ionicons name="star" size={11} color={Colors.primaryColor} />
                    <Text style={styles.ratingText}>{item.rating}</Text>
                  </View>
                </View>
                <View style={styles.destLocationRow}>
                  <Ionicons name="location" size={12} color={Colors.primaryColor} />
                  <Text style={styles.locationText} numberOfLines={1}>
                    {item.country}
                  </Text>
                </View>
              </BlurView>
            </View>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          isPending ? (
            <DestinationGridSkeleton count={4} />
          ) : isError ? (
            <TouchableOpacity style={styles.emptyState} onPress={() => refetch()}>
              <Ionicons name="cloud-offline-outline" size={64} color="#E0E0E0" />
              <Text style={styles.emptyTitle}>Could not load favorites</Text>
              <Text style={styles.emptySub}>Tap to retry</Text>
            </TouchableOpacity>
          ) : (
          <View style={styles.emptyState}>
            <Ionicons name="heart-outline" size={72} color="#E0E0E0" />
            <Text style={styles.emptyTitle}>No favorites yet</Text>
            <Text style={styles.emptySub}>Save destinations you love to find them here.</Text>
            <TouchableOpacity
              style={styles.exploreBtn}
              activeOpacity={0.85}
              onPress={() => router.push("/(tabs)/home")}
            >
              <Text style={styles.exploreBtnText}>Explore destinations</Text>
            </TouchableOpacity>
          </View>
          )
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingTop: 20,
    marginBottom: 16,
  },
  pageTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xLarge,
    color: Colors.tintColor,
  },
  countText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
    color: "#888",
  },

  listContent: {
    gap: 12,
    paddingBottom: 24,
  },
  row: {
    gap: 12,
  },

  /* Cards — same styles as home.tsx */
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

  /* Empty state */
  emptyState: {
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 80,
    gap: 12,
    paddingHorizontal: 20,
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
    textAlign: "center",
  },
  exploreBtn: {
    marginTop: 8,
    backgroundColor: Colors.primaryColor,
    paddingVertical: 14,
    paddingHorizontal: 28,
    borderRadius: 14,
  },
  exploreBtnText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.white,
  },
});

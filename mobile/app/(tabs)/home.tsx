import { categories, destinations, recommended } from "@/data/home";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import SearchModal from "@/components/SearchModal";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { BlurView } from "expo-blur";
import { router } from "expo-router";
import { useState } from "react";
import {
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
  const [activeCategory, setActiveCategory] = useState("1");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const [searchVisible, setSearchVisible] = useState(false);

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <View style={styles.imageWrapper}>
            <Image
              source={require("../../assets/image/avatar.jpg")}
              resizeMode="cover"
              style={{ width: "100%", height: "100%" }}
            />
          </View>
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerText}>
              Hi{" "}
              <Text
                style={{
                  textDecorationLine: "underline",
                  fontFamily: Fonts.bold,
                }}
              >
                John Doe
              </Text>{" "}
              👋
            </Text>
            <View style={styles.headerLocationContainer}>
              <Ionicons name="location" size={14} color="black" />
              <Text style={styles.headerLocation}>Ivory Coast</Text>
            </View>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity
            style={styles.bellWrapper}
            onPress={() => router.push("/notifications")}
            activeOpacity={0.8}
          >
            <Ionicons name="notifications-outline" size={32} color="black" />
            <View style={styles.badge}>
              <Text style={styles.badgeText}>3</Text>
            </View>
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
        </TouchableOpacity>
      </TouchableOpacity>

      <SearchModal
        visible={searchVisible}
        onClose={() => setSearchVisible(false)}
      />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Categories */}
        <Text style={styles.sectionTitle}>categories</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.categoriesContent}
        >
          {categories.map((cat) => (
            <TouchableOpacity
              key={cat.id}
              style={[
                styles.categoryChip,
                activeCategory === cat.id && styles.categoryChipActive,
              ]}
              onPress={() => setActiveCategory(cat.id)}
              activeOpacity={0.75}
            >
              <MaterialCommunityIcons
                name={cat.icon as any}
                size={18}
                color={activeCategory === cat.id ? "white" : Colors.textColor}
              />
              <Text
                style={[
                  styles.categoryText,
                  activeCategory === cat.id && styles.categoryTextActive,
                ]}
              >
                {cat.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Destination cards grid */}
        <View style={styles.destinationsGrid}>
          {destinations.map((dest) => (
            <TouchableOpacity
              key={dest.id}
              style={styles.destinationCard}
              onPress={() => router.push({ pathname: "/destination/[id]" as any, params: { id: dest.id } })}
              activeOpacity={0.95}
            >
              <View style={styles.destImageContainer}>
                <Image
                  source={dest.image}
                  style={styles.destinationImage}
                  resizeMode="cover"
                />
                <BlurView intensity={40} tint="dark" style={styles.priceTag}>
                  <Text style={styles.priceTagText}>{dest.price}$</Text>
                </BlurView>
                <TouchableOpacity
                  style={styles.heartButton}
                  onPress={() => toggleFavorite(dest.id)}
                  activeOpacity={0.8}
                >
                  <Ionicons
                    name={favorites.has(dest.id) ? "heart" : "heart-outline"}
                    size={16}
                    color={
                      favorites.has(dest.id) ? Colors.primaryColor : Colors.primaryColor 
                    }
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
        <Text style={[styles.sectionTitle, { marginTop: 8 }]}>Recommended</Text>
        {recommended.map((item) => (
          <View key={item.id} style={styles.recommendedCard}>
            <Image
              source={item.image}
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
                {item.description}
              </Text>
              <View style={styles.recommendedFooter}>
                <Text style={styles.recommendedPrice}>{item.price}$</Text>
                <TouchableOpacity
                  style={styles.detailsButton}
                  activeOpacity={0.8}
                >
                  <Text style={styles.detailsText}>details</Text>
                  <Ionicons name="eye-outline" size={13} color="white" />
                </TouchableOpacity>
              </View>
            </View>
          </View>
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
    paddingHorizontal: 16,
    paddingTop: 20,
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
  bellWrapper: {
    position: "relative",
  },
  badge: {
    position: "absolute",
    top: -2,
    right: -2,
    backgroundColor: Colors.primaryColor,
    width: 16,
    height: 16,
    borderRadius: 8,
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
  recommendedCard: {
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "rgba(217, 217, 217, 0.07)",
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

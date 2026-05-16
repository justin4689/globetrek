import { destinations } from "@/data/home";
import type { Review } from "@/types/home";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router, useLocalSearchParams } from "expo-router";
import { useRef, useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  NativeScrollEvent,
  NativeSyntheticEvent,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width, height } = Dimensions.get("window");
const HERO_HEIGHT = height * 0.48;
const REVIEW_CARD_WIDTH = width - 64;

function Stars({ rating }: { rating: number }) {
  return (
    <View style={{ flexDirection: "row", gap: 2 }}>
      {[1, 2, 3, 4, 5].map((i) => (
        <Ionicons
          key={i}
          name={i <= Math.round(rating) ? "star" : "star-outline"}
          size={14}
          color={Colors.primaryColor}
        />
      ))}
    </View>
  );
}

function ReviewCard({ review }: { review: Review }) {
  return (
    <View style={styles.reviewCard}>
      <View style={styles.reviewHeader}>
        <Image source={review.avatar} style={styles.reviewAvatar} resizeMode="cover" />
        <View style={styles.reviewMeta}>
          <Text style={styles.reviewName}>{review.name}</Text>
          <View style={styles.reviewRatingRow}>
            <Stars rating={review.rating} />
            <Text style={styles.reviewRatingText}>{review.rating}</Text>
          </View>
        </View>
        <TouchableOpacity style={styles.reviewDots}>
          <Ionicons name="ellipsis-vertical" size={18} color="#aaa" />
        </TouchableOpacity>
      </View>
      <Text style={styles.reviewText}>{review.text}</Text>
    </View>
  );
}

export default function DestinationDetail() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const destination = destinations.find((d) => d.id === id);
  const [activeTab, setActiveTab] = useState<"description" | "reviews">("description");
  const [activeReview, setActiveReview] = useState(0);
  const reviewsRef = useRef<FlatList>(null);

  if (!destination) return null;

  const shownThumbs = destination.images.slice(0, 3);
  const extraCount = destination.images.length - 3;

  const onReviewScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) => {
    const index = Math.round(e.nativeEvent.contentOffset.x / REVIEW_CARD_WIDTH);
    setActiveReview(index);
  };

  return (
    <View style={styles.root}>
      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero */}
        <View style={styles.heroContainer}>
          <Image
            source={destination.image}
            style={styles.heroImage}
            resizeMode="cover"
          />

          {/* Back button */}
          <TouchableOpacity
            style={[styles.backBtn, { top: insets.top + 12 }]}
            onPress={() => router.back()}
            activeOpacity={0.85}
          >
            <Ionicons name="arrow-back" size={20} color={Colors.textColor} />
          </TouchableOpacity>

          {/* Thumbnails */}
          <View style={styles.thumbsRow}>
            {shownThumbs.map((img, i) => (
              <TouchableOpacity key={i} style={styles.thumbWrapper} activeOpacity={0.85}>
                <Image source={img} style={styles.thumb} resizeMode="cover" />
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={styles.thumbWrapper} activeOpacity={0.85}>
              <Image
                source={destination.images[3]}
                style={styles.thumb}
                resizeMode="cover"
              />
              <View style={styles.thumbOverlay}>
                <Text style={styles.thumbOverlayText}>+{extraCount}</Text>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Content card */}
        <View style={styles.card}>
          {/* Name + Price */}
          <View style={styles.nameRow}>
            <Text style={styles.destName}>{destination.name}</Text>
            <Text style={styles.price}>${destination.price}</Text>
          </View>

          {/* Location + Stars */}
          <View style={styles.infoRow}>
            <View style={styles.locationRow}>
              <Ionicons name="location" size={14} color={Colors.primaryColor} />
              <Text style={styles.locationText}>{destination.country}</Text>
            </View>
            <View style={styles.starsRow}>
              <Stars rating={destination.rating} />
              <Text style={styles.ratingValue}>{destination.rating}</Text>
            </View>
          </View>

          {/* Divider */}
          <View style={styles.divider} />

          {/* Tabs */}
          <View style={styles.tabsRow}>
            <TouchableOpacity
              style={styles.tabBtn}
              onPress={() => setActiveTab("description")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "description" && styles.tabLabelActive,
                ]}
              >
                description
              </Text>
              {activeTab === "description" && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.tabBtn]}
              onPress={() => setActiveTab("reviews")}
              activeOpacity={0.8}
            >
              <Text
                style={[
                  styles.tabLabel,
                  activeTab === "reviews" && styles.tabLabelActive,
                ]}
              >
                Reviews
              </Text>
              {activeTab === "reviews" && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          </View>

          {/* Tab content */}
          {activeTab === "description" ? (
            <Text style={styles.description}>{destination.description}</Text>
          ) : (
            <View style={styles.reviewsSection}>
              <FlatList
                ref={reviewsRef}
                data={destination.reviews}
                keyExtractor={(r) => r.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                snapToInterval={REVIEW_CARD_WIDTH + 16}
                decelerationRate="fast"
                contentContainerStyle={styles.reviewsList}
                onScroll={onReviewScroll}
                scrollEventThrottle={16}
                renderItem={({ item }) => <ReviewCard review={item} />}
              />
              {/* Dots */}
              <View style={styles.dotsRow}>
                {destination.reviews.map((_, i) => (
                  <View
                    key={i}
                    style={[styles.dot, i === activeReview && styles.dotActive]}
                  />
                ))}
              </View>
            </View>
          )}

          <View style={{ height: 100 }} />
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, { paddingBottom: insets.bottom + 8 }]}>
        <TouchableOpacity style={styles.bookBtn} activeOpacity={0.85}>
          <Text style={styles.bookText}>Book</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.bookmarkBtn} activeOpacity={0.85}>
          <Ionicons name="bookmark-outline" size={24} color={Colors.textColor} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#fff",
  },
  heroContainer: {
    width,
    height: HERO_HEIGHT,
  },
  heroImage: {
    width: "100%",
    height: "100%",
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
  thumbsRow: {
    position: "absolute",
    bottom: -15,
    left: 35,
    flexDirection: "row",
    gap: 8,
    zIndex: 10,
  },
  thumbWrapper: {
    width: 70,
    height: 70,
    borderRadius: 12,
    overflow: "hidden",

  
  },
  thumb: {
    width: "100%",
    height: "100%",
  },
  thumbOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.45)",
    justifyContent: "center",
    alignItems: "center",
  },
  thumbOverlayText: {
    color: "white",
    fontFamily: Fonts.bold,
    fontSize: FontSizes.large,
  },
  card: {
    flex: 1,
    backgroundColor: "#fff",
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    marginTop: -20,
    paddingHorizontal: 20,
    paddingTop: 50,
  },
  nameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  destName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xLarge,
    color: Colors.textColor,
    flex: 1,
    marginRight: 12,

    textDecorationLine: "underline",
  },
  price: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xLarge,
    color: Colors.textColor,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 6,
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
  starsRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  ratingValue: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
    color: Colors.textColor,
  },
  divider: {
    height: 1,
    backgroundColor: "#F0F0F0",
    marginVertical: 16,
  },
  tabsRow: {
    flexDirection: "row", 

    justifyContent: 'space-between',
    gap: 24,
    marginBottom: 16,
  },
  tabBtn: {
    paddingBottom: 4,
  },
  tabLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.medium,
    color: "#aaa",
  },
  tabLabelActive: {
    color: Colors.textColor,
    fontFamily: Fonts.bold,
  },
  tabIndicator: {
    height: 2,
    backgroundColor: Colors.primaryColor,
    borderRadius: 1,
    marginTop: 4,
  },
  description: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: "#555",
    lineHeight: 22,
  },
  reviewsSection: {
    marginLeft: -20,
  },
  reviewsList: {
    paddingHorizontal: 20,
    gap: 16,
  },
  reviewCard: {
    width: REVIEW_CARD_WIDTH,
    backgroundColor: "#FAFAFA",
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: "#F0F0F0",
  },
  reviewHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    marginBottom: 12,
  },
  reviewAvatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
  },
  reviewMeta: {
    flex: 1,
    gap: 4,
  },
  reviewName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
  },
  reviewRatingRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
  reviewRatingText: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.small,
    color: "#888",
  },
  reviewDots: {
    padding: 4,
  },
  reviewText: {
    fontFamily: Fonts.regular,
    fontSize: 13,
    color: "#666",
    lineHeight: 20,
  },
  dotsRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 8,
    marginTop: 16,
  },
  dot: {
    width: 24,
    height: 4,
    borderRadius: 2,
    backgroundColor: "#E0E0E0",
  },
  dotActive: {
    backgroundColor: Colors.primaryColor,
    width: 32,
  },
  bottomBar: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 20,
    paddingTop: 12,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderTopColor: "#F0F0F0",
    gap: 12,
  },
  bookBtn: {
    flex: 1,
    backgroundColor: Colors.primaryColor,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
  },
  bookText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: "white",
  },
  bookmarkBtn: {
    width: 52,
    height: 52,
    borderRadius: 16,
    borderWidth: 1.5,
    borderColor: "#E0E0E0",
    justifyContent: "center",
    alignItems: "center",
  },
});

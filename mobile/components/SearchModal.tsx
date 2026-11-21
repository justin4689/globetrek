import { formatPrice } from "@/utils/format";
import { useDestinations } from "@/hooks/queries/useDestinationQueries";
import { useFavoriteIds, useToggleFavorite } from "@/hooks/queries/useFavoriteQueries";
import { imageSource } from "@/utils/api";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { router } from "expo-router";
import { ComponentRef, useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 32 - 12) / 2;

const RECENT_KEY = "recentSearches";
const MAX_RECENT = 5;

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SearchModal({ visible, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const inputRef = useRef<ComponentRef<typeof TextInput>>(null);
  const insets = useSafeAreaInsets();

  // Wait for the user to pause typing before hitting the API
  useEffect(() => {
    const t = setTimeout(() => setDebouncedQuery(query.trim()), 300);
    return () => clearTimeout(t);
  }, [query]);

  const searchQuery = useDestinations({ search: debouncedQuery });
  const results = debouncedQuery ? searchQuery.data ?? [] : [];
  const isSearching = !!query.trim() && (query.trim() !== debouncedQuery || searchQuery.isFetching);

  const favoriteIds = useFavoriteIds();
  const toggleFavorite = useToggleFavorite();

  const [recentSearches, setRecentSearches] = useState<string[]>([]);

  useEffect(() => {
    if (!visible) return;
    AsyncStorage.getItem(RECENT_KEY)
      .then((raw) => setRecentSearches(raw ? JSON.parse(raw) : []))
      .catch(() => setRecentSearches([]));
  }, [visible]);

  // Most recent first, no duplicates (case-insensitive), capped at MAX_RECENT
  const saveRecent = (term: string) => {
    const value = term.trim();
    if (!value) return;
    const next = [value, ...recentSearches.filter((s) => s.toLowerCase() !== value.toLowerCase())].slice(
      0,
      MAX_RECENT
    );
    setRecentSearches(next);
    AsyncStorage.setItem(RECENT_KEY, JSON.stringify(next)).catch(() => {});
  };

  const clearRecent = () => {
    setRecentSearches([]);
    AsyncStorage.removeItem(RECENT_KEY).catch(() => {});
  };

  const openDestination = (id: string) => {
    saveRecent(query);
    onClose();
    router.push({ pathname: "/destination/[id]" as any, params: { id } });
  };

  useEffect(() => {
    if (visible) {
      setTimeout(() => inputRef.current?.focus(), 100);
    } else {
      setQuery("");
    }
  }, [visible]);

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="fullScreen"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View style={[styles.container, { paddingTop: insets.top }]}>
        <KeyboardAvoidingView
          style={{ flex: 1 }}
          behavior={Platform.OS === "ios" ? "padding" : "height"}
        >
          {/* Search bar row */}
          <View style={styles.searchRow}>
            <TouchableOpacity onPress={onClose} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={Colors.textColor} />
            </TouchableOpacity>
            <View style={styles.inputWrapper}>
              <Ionicons name="search" size={18} color="#999" />
              <TextInput
                ref={inputRef}
                style={styles.input}
                placeholder="Where do you want to go?"
                placeholderTextColor="#aaa"
                value={query}
                onChangeText={setQuery}
                returnKeyType="search"
                onSubmitEditing={() => saveRecent(query)}
              />
              {query.length > 0 && (
                <TouchableOpacity onPress={() => setQuery("")}>
                  <Ionicons name="close-circle" size={18} color="#999" />
                </TouchableOpacity>
              )}
            </View>
          </View>

          {query.length === 0 ? (
            /* Recent searches */
            <View style={styles.section}>
              {recentSearches.length === 0 ? (
                <Text style={styles.hintText}>Search a destination or a country.</Text>
              ) : (
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent searches</Text>
                  <TouchableOpacity onPress={clearRecent} hitSlop={8}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                </View>
              )}
              {recentSearches.map((item) => (
                <TouchableOpacity
                  key={item}
                  style={styles.recentItem}
                  onPress={() => setQuery(item)}
                  activeOpacity={0.7}
                >
                  <Ionicons name="time-outline" size={18} color="#aaa" />
                  <Text style={styles.recentText}>{item}</Text>
                  <Ionicons name="arrow-forward-outline" size={16} color="#ccc" />
                </TouchableOpacity>
              ))}
            </View>
          ) : isSearching && results.length === 0 ? (
            <View style={styles.emptyState}>
              <ActivityIndicator color={Colors.primaryColor} />
            </View>
          ) : results.length === 0 ? (
            /* No results */
            <View style={styles.emptyState}>
              <Ionicons name="search-outline" size={48} color="#ddd" />
              <Text style={styles.emptyText}>No results for "{query}"</Text>
            </View>
          ) : (
            /* Results — 2-column grid */
            <FlatList
              data={results}
              keyExtractor={(item) => item._id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.card}
                  activeOpacity={0.95}
                  onPress={() => openDestination(item._id)}
                >
                  <View style={styles.cardImageContainer}>
                    <Image
                      source={imageSource(item.images[0])}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                    <BlurView intensity={40} tint="dark" style={styles.priceTag}>
                      <Text style={styles.priceTagText}>{formatPrice(item.price)}<Text style={styles.priceTagUnit}>/night</Text></Text>
                    </BlurView>
                    <TouchableOpacity
                      style={styles.heartButton}
                      onPress={() =>
                        toggleFavorite.mutate({
                          destinationId: item._id,
                          isFavorite: favoriteIds.has(item._id),
                        })
                      }
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={favoriteIds.has(item._id) ? "heart" : "heart-outline"}
                        size={16}
                        color={Colors.primaryColor}
                      />
                    </TouchableOpacity>
                    <BlurView intensity={60} tint="light" style={styles.cardInfo}>
                      <View style={styles.cardNameRow}>
                        <Text style={styles.cardName} numberOfLines={1}>
                          {item.name}
                        </Text>
                        <View style={styles.ratingBadge}>
                          <Ionicons name="star" size={11} color={Colors.primaryColor} />
                          <Text style={styles.ratingText}>{item.rating}</Text>
                        </View>
                      </View>
                      <View style={styles.cardLocationRow}>
                        <Ionicons name="location" size={12} color={Colors.primaryColor} />
                        <Text style={styles.locationText} numberOfLines={1}>
                          {item.country}
                        </Text>
                      </View>
                    </BlurView>
                  </View>
                </TouchableOpacity>
              )}
            />
          )}
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  searchRow: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 12,
    gap: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },
  backBtn: {
    padding: 4,
  },
  inputWrapper: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 10,
    gap: 8,
  },
  input: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
    padding: 0,
  },
  section: {
    paddingHorizontal: 16,
    paddingTop: 24,
  },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "baseline",
  },
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
    marginBottom: 12,
  },
  clearText: {
    fontFamily: Fonts.medium,
    fontSize: 14,
    color: Colors.primaryColor,
  },
  hintText: {
    fontFamily: Fonts.regular,
    fontSize: 14,
    color: "#999",
  },
  recentItem: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
    gap: 12,
  },
  recentText: {
    flex: 1,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
  },
  emptyState: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    gap: 12,
  },
  emptyText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: "#aaa",
  },
  resultsList: {
    padding: 16,
    paddingBottom: 24,
  },
  row: {
    gap: 12,
    marginBottom: 12,
  },
  card: {
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
  cardImageContainer: {
    width: "100%",
    height: 145,
  },
  cardImage: {
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
  cardInfo: {
    padding: 10,
    gap: 5,
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "rgba(255,255,255,0.45)",
  },
  cardNameRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  cardName: {
    fontFamily: Fonts.bold,
    fontSize: 13,
    color: Colors.textColor,
    flex: 1,
    marginRight: 4,
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
  cardLocationRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 2,
  },
  locationText: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "#777",
  },
});

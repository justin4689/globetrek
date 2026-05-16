import { destinations } from "@/data/home";
import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { BlurView } from "expo-blur";
import { useEffect, useRef, useState } from "react";
import {
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

const recentSearches = ["Maldives", "Bali", "Santorini", "Dubai"];

type Props = {
  visible: boolean;
  onClose: () => void;
};

export default function SearchModal({ visible, onClose }: Props) {
  const [query, setQuery] = useState("");
  const [favorites, setFavorites] = useState<Set<string>>(new Set());
  const inputRef = useRef<TextInput>(null);
  const insets = useSafeAreaInsets();

  const results = query.trim()
    ? destinations.filter(
        (d) =>
          d.name.toLowerCase().includes(query.toLowerCase()) ||
          d.country.toLowerCase().includes(query.toLowerCase())
      )
    : [];

  const toggleFavorite = (id: string) => {
    setFavorites((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
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
              <Text style={styles.sectionTitle}>Recent searches</Text>
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
              keyExtractor={(item) => item.id}
              numColumns={2}
              columnWrapperStyle={styles.row}
              contentContainerStyle={styles.resultsList}
              keyboardShouldPersistTaps="handled"
              showsVerticalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.card}>
                  <View style={styles.cardImageContainer}>
                    <Image
                      source={item.image}
                      style={styles.cardImage}
                      resizeMode="cover"
                    />
                    <BlurView intensity={40} tint="dark" style={styles.priceTag}>
                      <Text style={styles.priceTagText}>{item.price}$</Text>
                    </BlurView>
                    <TouchableOpacity
                      style={styles.heartButton}
                      onPress={() => toggleFavorite(item.id)}
                      activeOpacity={0.8}
                    >
                      <Ionicons
                        name={favorites.has(item.id) ? "heart" : "heart-outline"}
                        size={16}
                        color={favorites.has(item.id) ? Colors.primaryColor : Colors.primaryColor}
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
                </View>
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
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
    marginBottom: 12,
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

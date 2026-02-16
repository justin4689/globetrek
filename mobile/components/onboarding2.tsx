import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, FontSizes, Fonts } from "../utils/constants";

export default function Onboarding2() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <Pressable
        onPress={() => router.replace("/login")}
        style={{ alignItems: "flex-end" }}
      >
        <Text style={styles.textSkip}>Skip</Text>
      </Pressable>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/image/image4.jpg")}
          style={styles.image}
        />
        <Image
          source={require("../assets/image/image5.jpg")}
          style={styles.image}
        />
        <Image
          source={require("../assets/image/image6.jpg")}
          style={[styles.image, styles.image1]}
        />
      </View>
      <View style={{ marginTop: 130 }}>
        <Text style={[styles.title1]}>Go beyond</Text>
        <View style={styles.badge}>
          <View style={styles.badgeInner}>
            <Text style={styles.title2}>Discover</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Explore stunning destinations, discover local cultures, and enjoy
          seamless travel experiences designed to make every journey
          unforgettable.
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  textSkip: {
    fontSize: FontSizes.regular,
    color: Colors.tintColor,
    fontFamily: Fonts.bold,
    textAlign: "right",
    textDecorationLine: "underline",
  },
  imageContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginTop: 44,
    position: "relative",
  },
  image: {
    width: 165,
    height: 193,
    borderRadius: 10,
    resizeMode: "cover",
  },

  image1: {
    position: "absolute",
    top: 130,
    left: 60,
    width: 235,
    height: 147,
  },
  title1: {
    fontSize: FontSizes.xxxLarge,
    color: Colors.tintColor,
    fontFamily: Fonts.bold,
    width: 200,
  },

  badge: {
    backgroundColor: Colors.primaryColor,
    padding: 8,
    paddingLeft: 15,
    width: 250.93,
    transform: [{ skewX: "30deg" }],
    marginLeft: 15,
    marginTop: 15,
  },

  badgeInner: {
    transform: [{ skewX: "-30deg" }],
  },

  title2: {
    fontSize: FontSizes.xxxLarge,
    color: Colors.white,
    fontFamily: Fonts.bold,
  },

  subtitle: {
    fontSize: FontSizes.medium,
    color: Colors.textColor,
    fontFamily: Fonts.regular,
    marginTop: 20,
    marginBottom: 10,
    lineHeight: 25,
  },
});

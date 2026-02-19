import { router } from "expo-router";
import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Colors, FontSizes, Fonts } from "../utils/constants";

export default function Onboarding3() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <View style={styles.imageContainer}>
        <Image
          source={require("../assets/image/image7.jpg")}
          style={styles.image}
        />
        <Image
          source={require("../assets/image/image8.jpg")}
          style={styles.image}
        />
        <Image
          source={require("../assets/image/image9.jpg")}
          style={[styles.image, styles.image1]}
        />
      </View>
      <View style={{ marginTop: 130 }}>
        <Text style={[styles.title1]}>FIND NEW</Text>
        <View style={styles.badge}>
          <View style={styles.badgeInner}>
            <Text style={styles.title2}>Adventures</Text>
          </View>
        </View>
        <Text style={styles.subtitle}>
          Every journey begins with a desire to explore. Discover carefully
          selected destinations, immersive experiences, and seamless travel
          planning designed to transform each trip into a meaningful and
          unforgettable adventure.
        </Text>
      </View>

      <Pressable
        onPress={() => router.replace("/login")}
        android_ripple={{ color: "transparent" }}
        style={({ pressed }) => [
          styles.btnContainer,
          { opacity: pressed ? 0.6 : 1 },
        ]}
      >
        <Text style={styles.btnText}>Next</Text>
      </Pressable>
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

  btnContainer: {
    paddingVertical: 12,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    backgroundColor: Colors.secondaryColor,
    borderRadius: 10,
    marginTop: 12,
  },

  btnText: {
    fontSize: FontSizes.regular,
    color: Colors.white,
    fontFamily: Fonts.bold,
  },
});

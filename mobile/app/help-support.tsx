import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Images from "@/utils/images";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import {
  Image,
  Linking,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function HelpSupport() {
  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
          <Ionicons name="arrow-back" size={24} color={Colors.tintColor} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Help & Support</Text>
        <View style={styles.backBtn} />
      </View>

      {/* Illustration */}
      <View style={styles.illustrationContainer}>
        <Image source={Images.image21} style={styles.illustration} resizeMode="contain" />
      </View>

      {/* Contact Cards */}
      <View style={styles.cardsContainer}>
        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.75}
          onPress={() => Linking.openURL("mailto:info@globetrek.com")}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="mail-outline" size={24} color={Colors.textColor} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Email us</Text>
            <Text style={styles.cardSub}>info@globetrek.com</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.75}
          onPress={() => Linking.openURL("tel:+2250778541355")}
        >
          <View style={styles.cardIcon}>
            <Ionicons name="call-outline" size={24} color={Colors.textColor} />
          </View>
          <View style={styles.cardInfo}>
            <Text style={styles.cardTitle}>Call us</Text>
            <Text style={styles.cardSub}>+225 0778541355</Text>
          </View>
          <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
        </TouchableOpacity>
      </View>

      {/* Social Media */}
      <View style={styles.socialRow}>
        <Pressable
          style={({ pressed }) => [styles.socialBtn, { opacity: pressed ? 0.7 : 1 }]}
          onPress={() => Linking.openURL("https://www.facebook.com/share/1BU6MovJuV/?mibextid=wwXIfr")}
        >
          <MaterialCommunityIcons name="facebook" size={40} color="#1877F2" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.socialBtn, { opacity: pressed ? 0.7 : 1 }]}
          onPress={() => Linking.openURL("https://instagram.com/justin_obiang2")}
        >
          <MaterialCommunityIcons name="instagram" size={40} color="#E1306C" />
        </Pressable>

        <Pressable
          style={({ pressed }) => [styles.socialBtn, { opacity: pressed ? 0.7 : 1 }]}
          onPress={() => Linking.openURL("https://wa.me/2250778541355")}
        >
          <MaterialCommunityIcons name="whatsapp" size={40} color="#25D366" />
        </Pressable>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 20,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 8,
  },
  backBtn: {
    width: 36,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xLarge,
    color: Colors.tintColor,
  },

  /* Illustration */
  illustrationContainer: {
    alignItems: "center",
    marginVertical: 24,
  },
  illustration: {
    width: 260,
    height: 200,
  },

  /* Cards */
  cardsContainer: {
    gap: 14,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F7F8FA",
    borderRadius: 14,
    padding: 16,
    gap: 14,
  },
  cardIcon: {
    width: 44,
    height: 44,
    borderRadius: 12,
    backgroundColor: Colors.white,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 2,
  },
  cardInfo: {
    flex: 1,
  },
  cardTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.tintColor,
    marginBottom: 2,
  },
  cardSub: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: "#888",
  },

  /* Social */
  socialRow: {
    flexDirection: "row",
    justifyContent: "center",
    gap: 28,
    marginTop: 48,
  },
  socialBtn: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#F7F8FA",
    alignItems: "center",
    justifyContent: "center",
  },
});

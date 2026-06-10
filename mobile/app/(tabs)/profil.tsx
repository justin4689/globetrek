import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Images from "@/utils/images";
import Ionicons from "@expo/vector-icons/Ionicons";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Alert,
  Image,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useAuth } from "@/context/AuthContext";

export default function Profil() {
  const { logout } = useAuth();
  const [notifications, setNotifications] = useState(true);
  const [locationAccess, setLocationAccess] = useState(true);
  const [faceId, setFaceId] = useState(true);

  const handleLogout = () => {
    Alert.alert(
      'Déconnexion',
      'Êtes-vous sûr de vouloir vous déconnecter ?',
      [
        { text: 'Annuler', style: 'cancel' },
        { text: 'Déconnecter', style: 'destructive', onPress: () => logout() },
      ]
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={["top", "left", "right"]}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}


      >

        <Image
          source={Images.logo}
          style={styles.logo}
          resizeMode="cover"
        />
        {/* Header title */}
        <Text style={styles.pageTitle}>Profile</Text>

        {/* Profile Card */}
        <View style={styles.profileCard}>
          <View style={styles.avatarWrapper}>
            <Image
              source={Images.avatar}
              style={styles.avatar}
              resizeMode="cover"
            />
          </View>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>John Doe</Text>
            <Text style={styles.profileEmail}>johndoe@gmail.com</Text>
            <View style={styles.profileMeta}>
              <Ionicons
                name="location-outline"
                size={13}
                color={Colors.textColor}
              />
              <Text style={styles.profileMetaText}>Ivory Coast</Text>
              <View style={styles.metaSeparator} />
              <Ionicons
                name="call-outline"
                size={13}
                color={Colors.textColor}  
              />
              <Text style={styles.profileMetaText}>+22507865413SS</Text>
            </View>
          </View>
          <TouchableOpacity style={styles.editButton} activeOpacity={0.7}>
            <Ionicons name="create-outline" size={20} color={Colors.textColor} />
          </TouchableOpacity>
        </View>

        {/* Account Section */}
        <Text style={styles.sectionTitle}>Account</Text>
        <View style={styles.card}>
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7}  onPress={() => router.push('/edit-profil')}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <Ionicons
                  name="person-outline"
                  size={20}
                  color={Colors.textColor}
                />
              </View>
              <View>
                <Text style={styles.menuLabel}>Account details</Text>
                <Text style={styles.menuSub}>Manage your account details</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
          </TouchableOpacity>

          <View style={styles.divider} />

          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/change-password')}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <Ionicons
                  name="lock-closed-outline"
                  size={20}
                  color={Colors.textColor}
                />
              </View>
              <View>
                <Text style={styles.menuLabel}>Change password</Text>
                <Text style={styles.menuSub}>Manage your password</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
          </TouchableOpacity>
        </View>

        {/* Preferences Section */}
        <Text style={styles.sectionTitle}>Preferences</Text>
        <View style={styles.card}>
          {/* Notifications */}
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <Ionicons
                  name="notifications-outline"
                  size={20}
                  color={Colors.textColor}
                />
              </View>
              <View>
                <Text style={styles.menuLabel}>Notifications</Text>
                <Text style={styles.menuSub}>Enable to receive push notification</Text>
              </View>
            </View>
            <Switch
              value={notifications}
              onValueChange={setNotifications}
              trackColor={{ false: "#E0E0E0", true: Colors.primaryColor }}
              thumbColor="#fff"
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          <View style={styles.divider} />

          {/* Location Access */}
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <Ionicons
                  name="location-outline"
                  size={20}
                  color={Colors.textColor}
                />
              </View>
              <View>
                <Text style={styles.menuLabel}>Location access</Text>
                <Text style={styles.menuSub}>Activate location</Text>
              </View>
            </View>
            <Switch
              value={locationAccess}
              onValueChange={setLocationAccess}
              trackColor={{ false: "#E0E0E0", true: Colors.primaryColor }}
              thumbColor="#fff"
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          <View style={styles.divider} />

          {/* Face ID */}
          <View style={styles.menuItem}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <MaterialCommunityIcons
                  name="face-recognition"
                  size={20}
                  color={Colors.textColor}
                />
              </View>
              <View>
                <Text style={styles.menuLabel}>Face id</Text>
                <Text style={styles.menuSub}>Activate or deactivate face id</Text>
              </View>
            </View>
            <Switch
              value={faceId}
              onValueChange={setFaceId}
              trackColor={{ false: "#E0E0E0", true: Colors.primaryColor }}
              thumbColor="#fff"
              ios_backgroundColor="#E0E0E0"
            />
          </View>

          <View style={styles.divider} />

          {/* Help & Support */}
          <TouchableOpacity style={styles.menuItem} activeOpacity={0.7} onPress={() => router.push('/help-support')}>
            <View style={styles.menuLeft}>
              <View style={styles.menuIconWrapper}>
                <Ionicons
                  name="help-circle-outline"
                  size={20}
                  color={Colors.textColor}
                />
              </View>
              <View>
                <Text style={styles.menuLabel}>Help & Support</Text>
                <Text style={styles.menuSub}>Contact us for help</Text>
              </View>
            </View>
            <Ionicons name="chevron-forward" size={18} color="#BDBDBD" />
          </TouchableOpacity>
        </View>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} activeOpacity={0.8} onPress={handleLogout}>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F7F8FA",
  },
  scrollContent: {
    paddingHorizontal: 16,
    paddingBottom: 32,
  },
  pageTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xLarge,
    color: Colors.textColor,
    marginTop: 12,
    marginBottom: 16,
  },

  /* Profile Card */
  profileCard: {
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 16,
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
  },
  avatarWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    overflow: "hidden",
    marginRight: 12,
  },
  avatar: {
    width: "100%",
    height: "100%",
  },
  profileInfo: {
    flex: 1,
  },
  profileName: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.regular,
    color: Colors.textColor,
    marginBottom: 2,
  },
  profileEmail: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: "#888",
    marginBottom: 6,
  },
  profileMeta: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    gap: 4,
  },
  profileMetaText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.small,
    color: "#888",
  },
  metaSeparator: {
    width: 1,
    height: 12,
    backgroundColor: "#E0E0E0",
    marginHorizontal: 4,
  },
  editButton: {
    padding: 6,
  },

  /* Section */
  sectionTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
    marginBottom: 10,
  },
  card: {
    backgroundColor: "#fff",
    borderRadius: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 8,
    elevation: 3,
    overflow: "hidden",
  },

  /* Menu Items */
  menuItem: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  menuLeft: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    gap: 12,
  },
  menuIconWrapper: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: "#F7F8FA",
    alignItems: "center",
    justifyContent: "center",
  },
  menuLabel: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.medium - 1,
    color: Colors.textColor,
    marginBottom: 2,
  },
  menuSub: {
    fontFamily: Fonts.regular,
    fontSize: 11,
    color: "#BDBDBD",
  },
  divider: {
    height: 1,
    backgroundColor: "#F5F5F5",
    marginHorizontal: 16,
  },

  /* Logout */
  logoutButton: {
    backgroundColor: Colors.primaryColor,
    borderRadius: 14,
    paddingVertical: 16,
    alignItems: "center",
    marginTop: 4,
  },
  logoutText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.regular,
    color: "#fff",
    letterSpacing: 0.5,
  },

  logo: {
    width: 100,
    height: 90,
    alignSelf: "center",
    
  },
});

import { Colors, Fonts, FontSizes } from "@/utils/constants";
import Images from "@/utils/images";
import Ionicons from "@expo/vector-icons/Ionicons";
import { router } from "expo-router";
import { useState } from "react";
import {
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const COUNTRY_CODES = [
  { code: "+225", flag: "🇨🇮" },
  { code: "+33",  flag: "🇫🇷" },
  { code: "+1",   flag: "🇺🇸" },
  { code: "+44",  flag: "🇬🇧" },
  { code: "+212", flag: "🇲🇦" },
  { code: "+221", flag: "🇸🇳" },
];

export default function EditProfil() {
  const [firstname, setFirstname] = useState("John");
  const [lastname, setLastname]   = useState("Doe");
  const [email, setEmail]         = useState("johndoe@gmail.com");
  const [phone, setPhone]         = useState("07 78 54 13 55");
  const [countryCode, setCountryCode] = useState("+225");
  const [showPicker, setShowPicker]   = useState(false);

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1, width: "100%" }}
      >
        <ScrollView
          contentContainerStyle={styles.scroll}
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity onPress={() => router.back()} style={styles.backBtn}>
              <Ionicons name="arrow-back" size={24} color={Colors.tintColor} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profil</Text>
            <View style={styles.backBtn} />
          </View>

          {/* Avatar */}
          <View style={styles.avatarSection}>
            <View style={styles.avatarWrapper}>
              <Image source={Images.avatar} style={styles.avatar} resizeMode="cover" />
              <View style={styles.cameraOverlay}>
                <Ionicons name="camera" size={14} color={Colors.white} />
              </View>
            </View>
          </View>

          {/* Form */}
          <View style={styles.form}>
            <View style={styles.field}>
              <Text style={styles.label}>Firstname</Text>
              <TextInput
                style={styles.input}
                value={firstname}
                onChangeText={setFirstname}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Lastname</Text>
              <TextInput
                style={styles.input}
                value={lastname}
                onChangeText={setLastname}
                autoCapitalize="words"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Email</Text>
              <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.field}>
              <Text style={styles.label}>Phone number</Text>
              <View style={styles.phoneRow}>
                <TouchableOpacity
                  style={styles.countryPicker}
                  activeOpacity={0.7}
                  onPress={() => setShowPicker((v) => !v)}
                >
                  <Text style={styles.countryCode}>{countryCode}</Text>
                  <Ionicons name="chevron-down" size={14} color={Colors.textColor} />
                </TouchableOpacity>

                <TextInput
                  style={styles.phoneInput}
                  value={phone}
                  onChangeText={setPhone}
                  keyboardType="phone-pad"
                />
              </View>

              {showPicker && (
                <View style={styles.pickerDropdown}>
                  {COUNTRY_CODES.map((item) => (
                    <Pressable
                      key={item.code}
                      style={({ pressed }) => [
                        styles.pickerItem,
                        pressed && { backgroundColor: "#F0F0F0" },
                        countryCode === item.code && styles.pickerItemActive,
                      ]}
                      onPress={() => {
                        setCountryCode(item.code);
                        setShowPicker(false);
                      }}
                    >
                      <Text style={styles.pickerItemText}>
                        {item.flag}  {item.code}
                      </Text>
                    </Pressable>
                  ))}
                </View>
              )}
            </View>
          </View>

          {/* Update Button */}
          <Pressable
            style={({ pressed }) => [styles.button, { opacity: pressed ? 0.75 : 1 }]}
            onPress={() => router.back()}
          >
            <Text style={styles.buttonText}>Update</Text>
          </Pressable>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
  },
  scroll: {
    paddingHorizontal: 20,
    paddingBottom: 32,
    flexGrow: 1,
  },

  /* Header */
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: 4,
    marginBottom: 24,
  },
  backBtn: {
    width: 36,
  },
  headerTitle: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.xLarge,
    color: Colors.tintColor,
  },

  /* Avatar */
  avatarSection: {
    alignItems: "center",
    marginBottom: 32,
  },
  avatarWrapper: {
    position: "relative",
    width: 90,
    height: 90,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  cameraOverlay: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 26,
    height: 26,
    borderRadius: 13,
    backgroundColor: Colors.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    borderWidth: 2,
    borderColor: Colors.white,
  },

  /* Form */
  form: {
    gap: 20,
    flex: 1,
  },
  field: {
    gap: 6,
  },
  label: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.medium - 1,
    color: Colors.tintColor,
  },
  input: {
    height: 52,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
    backgroundColor: Colors.white,
  },

  /* Phone */
  phoneRow: {
    flexDirection: "row",
    gap: 10,
  },
  countryPicker: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    height: 52,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 12,
    backgroundColor: Colors.white,
  },
  countryCode: {
    fontFamily: Fonts.medium,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
  },
  phoneInput: {
    flex: 1,
    height: 52,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    paddingHorizontal: 14,
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
    backgroundColor: Colors.white,
  },
  pickerDropdown: {
    marginTop: 4,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    borderRadius: 10,
    backgroundColor: Colors.white,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 6,
  },
  pickerItem: {
    paddingVertical: 12,
    paddingHorizontal: 16,
  },
  pickerItemActive: {
    backgroundColor: "#FFF3EE",
  },
  pickerItemText: {
    fontFamily: Fonts.regular,
    fontSize: FontSizes.medium,
    color: Colors.textColor,
  },

  /* Button */
  button: {
    marginTop: 36,
    backgroundColor: Colors.primaryColor,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: "center",
  },
  buttonText: {
    fontFamily: Fonts.bold,
    fontSize: FontSizes.regular,
    color: Colors.white,
  },
});

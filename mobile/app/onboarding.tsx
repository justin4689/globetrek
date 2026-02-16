import Onboarding1 from "@/components/onboarding1";
import Onboarding2 from "@/components/onboarding2";
import Onboarding3 from "@/components/onboarding3";
import { Colors, Fonts } from "@/utils/constants";
import { useState } from "react";
import { Dimensions, ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
const { width } = Dimensions.get("window");
export default function Onboarding() {
  const [activeIndex, setActiveIndex] = useState(0);
  const handleScroll = (event: any) => {
    const slide = Math.round(event.nativeEvent.contentOffset.x / width);
    setActiveIndex(slide);
  };
  return (
    <SafeAreaView style={styles.container}>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={handleScroll}
      >
        <View style={{ width }}>
          <Onboarding1 />
        </View>
        <View style={{ width }}>
          <Onboarding2 />
        </View>
        <View style={{ width }}>
          <Onboarding3 />
        </View>
      </ScrollView>
      {activeIndex !== 2 && (
        <View
          style={{
            marginTop: 15,
            flexDirection: "row",
            justifyContent: "center",
            gap: 5,
          }}
        >
          <View
            style={[styles.dot, { opacity: activeIndex === 0 ? 1 : 0.5 }]}
          />
          <View
            style={[styles.dot, { opacity: activeIndex === 1 ? 1 : 0.5 }]}
          />
          <View
            style={[styles.dot, { opacity: activeIndex === 2 ? 1 : 0.5 }]}
          />
        </View>
      )}
    </SafeAreaView>
  );
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    fontFamily: Fonts.regular,
  },
  dotsContainer: {
    flexDirection: "row",
    justifyContent: "center",
    marginBottom: 20,
  },
  dot: {
    width: 20,
    height: 4,
    borderRadius: 5,
    backgroundColor: Colors.secondaryColor,
    marginLeft: 10,
    marginTop: 10,
  },
});

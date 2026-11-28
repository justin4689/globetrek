import { imageSource } from "@/utils/api";
import { Fonts } from "@/utils/constants";
import Ionicons from "@expo/vector-icons/Ionicons";
import { useState } from "react";
import {
  Dimensions,
  FlatList,
  Image,
  Modal,
  NativeScrollEvent,
  NativeSyntheticEvent,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const { width } = Dimensions.get("window");

type Props = {
  images: string[];
  /** Photo shown when the gallery opens; null keeps it closed */
  startIndex: number | null;
  onClose: (lastIndex: number) => void;
};

/** Full-screen photo viewer: swipe between photos, counter on top, close button. */
export function PhotoGallery({ images, startIndex, onClose }: Props) {
  const insets = useSafeAreaInsets();
  const [index, setIndex] = useState(0);

  const onScroll = (e: NativeSyntheticEvent<NativeScrollEvent>) =>
    setIndex(Math.round(e.nativeEvent.contentOffset.x / width));

  return (
    <Modal
      visible={startIndex !== null}
      animationType="fade"
      onShow={() => setIndex(startIndex ?? 0)}
      onRequestClose={() => onClose(index)}
      supportedOrientations={["portrait"]}
    >
      <StatusBar barStyle="light-content" />
      <View style={styles.root} testID="photo-gallery">
        {startIndex !== null && (
          <FlatList
            data={images}
            keyExtractor={(img, i) => `${i}-${img}`}
            horizontal
            pagingEnabled
            showsHorizontalScrollIndicator={false}
            initialScrollIndex={startIndex}
            getItemLayout={(_, i) => ({ length: width, offset: width * i, index: i })}
            onMomentumScrollEnd={onScroll}
            renderItem={({ item }) => (
              <Image source={imageSource(item)} style={styles.photo} resizeMode="contain" />
            )}
          />
        )}

        <View style={[styles.topBar, { top: insets.top + 8 }]}>
          <Text style={styles.counter}>
            {index + 1} / {images.length}
          </Text>
          <TouchableOpacity
            style={styles.closeBtn}
            onPress={() => onClose(index)}
            testID="photo-gallery-close"
            accessibilityLabel="Close photos"
            hitSlop={12}
          >
            <Ionicons name="close" size={24} color="#fff" />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: "#000",
  },
  photo: {
    width,
    height: "100%",
  },
  topBar: {
    position: "absolute",
    left: 16,
    right: 16,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  counter: {
    color: "#fff",
    fontFamily: Fonts.medium,
    fontSize: 15,
  },
  closeBtn: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: "rgba(255,255,255,0.15)",
    alignItems: "center",
    justifyContent: "center",
  },
});

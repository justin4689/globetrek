import { Dimensions, DimensionValue, StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import Animated, { cubicBezier, useReducedMotion } from "react-native-reanimated";

const BASE_COLOR = "#E9ECEF";

// Opacity-only pulse, run by Reanimated on the UI thread (keeps going while JS is busy loading)
const pulse = {
  animationName: { from: { opacity: 1 }, to: { opacity: 0.45 } },
  animationDuration: "900ms",
  animationIterationCount: "infinite",
  animationDirection: "alternate",
  animationTimingFunction: cubicBezier(0.77, 0, 0.175, 1),
} as const;

type SkeletonProps = {
  width?: DimensionValue;
  height?: DimensionValue;
  radius?: number;
  style?: StyleProp<ViewStyle>;
};

/** A placeholder block that pulses while content loads (static when Reduce Motion is on). */
export function Skeleton({ width = "100%", height = 14, radius = 8, style }: SkeletonProps) {
  const reducedMotion = useReducedMotion();
  return (
    <Animated.View
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      style={[
        { width, height, borderRadius: radius, backgroundColor: BASE_COLOR },
        !reducedMotion && pulse,
        style,
      ]}
    />
  );
}

// ─── Ready-made layouts matching the real screens ─────────────────────────────

const { width: SCREEN_WIDTH } = Dimensions.get("window");
const GRID_CARD_WIDTH = (SCREEN_WIDTH - 32 - 12) / 2;

/** Two-column destination cards (home, favorites, search). */
export function DestinationGridSkeleton({ count = 4 }: { count?: number }) {
  return (
    <View style={styles.grid} accessibilityLabel="Loading destinations">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={[styles.gridCard, { width: GRID_CARD_WIDTH }]}>
          <Skeleton height={145} radius={0} />
          <View style={styles.gridCardBody}>
            <Skeleton width="70%" height={14} />
            <Skeleton width="45%" height={12} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Horizontal "Recommended" rows on home. */
export function RecommendedSkeleton({ count = 3 }: { count?: number }) {
  return (
    <View accessibilityLabel="Loading recommendations">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={styles.recoRow}>
          <Skeleton width={95} height={105} radius={0} />
          <View style={styles.recoBody}>
            <Skeleton width="60%" height={14} />
            <Skeleton width="95%" height={11} />
            <Skeleton width="80%" height={11} />
            <Skeleton width="35%" height={16} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Large image cards (reservations list). */
export function ReservationListSkeleton({ count = 2 }: { count?: number }) {
  return (
    <View style={{ gap: 16 }} accessibilityLabel="Loading reservations">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={styles.bigCard}>
          <Skeleton height={180} radius={0} />
          <View style={styles.bigCardBody}>
            <Skeleton width="55%" height={18} />
            <Skeleton width="30%" height={12} />
            <Skeleton height={56} radius={12} />
            <Skeleton width="35%" height={18} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Icon + two lines rows (notifications list). */
export function ListRowSkeleton({ count = 6 }: { count?: number }) {
  return (
    <View accessibilityLabel="Loading">
      {Array.from({ length: count }, (_, i) => (
        <View key={i} style={styles.row}>
          <Skeleton width={50} height={50} radius={25} />
          <View style={styles.rowBody}>
            <Skeleton width="50%" height={14} />
            <Skeleton width="85%" height={12} />
            <Skeleton width="20%" height={10} />
          </View>
        </View>
      ))}
    </View>
  );
}

/** Hero image + title + paragraph (destination, reservation, booking details). */
export function DetailSkeleton({ heroHeight = 300 }: { heroHeight?: number }) {
  return (
    <View style={styles.detail} accessibilityLabel="Loading">
      <Skeleton height={heroHeight} radius={0} />
      <View style={styles.detailBody}>
        <View style={styles.detailTitleRow}>
          <Skeleton width="50%" height={24} />
          <Skeleton width="20%" height={24} />
        </View>
        <Skeleton width="30%" height={14} />
        <View style={{ height: 12 }} />
        {Array.from({ length: 6 }, (_, i) => (
          <Skeleton key={i} width={i === 5 ? "60%" : "100%"} height={12} />
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  gridCard: { borderRadius: 16, overflow: "hidden", backgroundColor: "#fff" },
  gridCardBody: { padding: 10, gap: 8 },

  recoRow: {
    flexDirection: "row",
    borderRadius: 14,
    overflow: "hidden",
    backgroundColor: "#FCFCFC",
    marginBottom: 12,
  },
  recoBody: { flex: 1, padding: 10, gap: 8 },

  bigCard: { borderRadius: 18, overflow: "hidden", backgroundColor: "#fff" },
  bigCardBody: { padding: 16, gap: 10 },

  row: { flexDirection: "row", alignItems: "center", gap: 14, paddingHorizontal: 16, paddingVertical: 14 },
  rowBody: { flex: 1, gap: 7 },

  detail: { flex: 1, backgroundColor: "#fff" },
  detailBody: { padding: 24, gap: 10 },
  detailTitleRow: { flexDirection: "row", justifyContent: "space-between" },
});

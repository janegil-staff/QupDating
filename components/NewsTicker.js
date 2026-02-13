import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  Animated,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

const FALLBACK_ITEMS = [
  { text: "Welcome to QUP Dating! Complete your profile to get more matches.", type: "tip" },
  { text: "Tip: Add more photos to increase your visibility by up to 70%.", type: "tip" },
];

export default function NewsTicker() {
  const [items, setItems] = useState(FALLBACK_ITEMS);
  const [currentIndex, setCurrentIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const slideAnim = useRef(new Animated.Value(0)).current;

  // Fetch news from backend
  useEffect(() => {
    const fetchNews = async () => {
      try {
        const res = await fetch("https://qup.dating/api/mobile/news");
        const data = await res.json();
        if (data.items && data.items.length > 0) {
          setItems(data.items);
        }
      } catch (err) {
        // Use fallback items silently
      }
    };

    fetchNews();
    // Refresh every 5 minutes
    const interval = setInterval(fetchNews, 5 * 60 * 1000);
    return () => clearInterval(interval);
  }, []);

  // Rotate through items
  useEffect(() => {
    if (items.length <= 1) return;

    const timer = setInterval(() => {
      // Fade out + slide up
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: -20,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start(() => {
        setCurrentIndex((prev) => (prev + 1) % items.length);
        slideAnim.setValue(20);

        // Fade in + slide down
        Animated.parallel([
          Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
          }),
          Animated.timing(slideAnim, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
          }),
        ]).start();
      });
    }, 5000);

    return () => clearInterval(timer);
  }, [items]);

  if (!items || items.length === 0) return null;

  const current = items[currentIndex];
  const icon = current.type === "tip" ? "bulb-outline" : "megaphone-outline";
  const iconColor = current.type === "tip" ? "#fbbf24" : "#60a5fa";

  return (
    <View style={styles.container}>
      <View style={styles.iconContainer}>
        <Ionicons name={icon} size={16} color={iconColor} />
      </View>
      <Animated.View
        style={[
          styles.textContainer,
          {
            opacity: fadeAnim,
            transform: [{ translateY: slideAnim }],
          },
        ]}
      >
        <Text style={styles.text} numberOfLines={1} ellipsizeMode="tail">
          {current.text}
        </Text>
      </Animated.View>
      {items.length > 1 && (
        <View style={styles.dots}>
          {items.map((_, i) => (
            <View
              key={i}
              style={[
                styles.dot,
                i === currentIndex && styles.dotActive,
              ]}
            />
          ))}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "rgba(255,255,255,0.05)",
    marginHorizontal: 16,
    marginTop: 8,
    marginBottom: 4,
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "rgba(255,255,255,0.08)",
    overflow: "hidden",
  },
  iconContainer: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: "rgba(255,255,255,0.08)",
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  textContainer: {
    flex: 1,
  },
  text: {
    color: "rgba(255,255,255,0.8)",
    fontSize: 13,
    fontWeight: "500",
    lineHeight: 18,
  },
  dots: {
    flexDirection: "row",
    gap: 4,
    marginLeft: 8,
  },
  dot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: "rgba(255,255,255,0.2)",
  },
  dotActive: {
    backgroundColor: "#e94560",
    width: 8,
  },
});

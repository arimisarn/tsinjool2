// app/index.tsx
import { View, StyleSheet } from "react-native";
import { WebView } from "react-native-webview";

export default function Home() {
  return (
    <View style={styles.container}>
      <WebView source={{ uri: "https://tsinjool.vercel.app" }} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

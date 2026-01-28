import { StatusBar } from "expo-status-bar";
import { useState, useEffect, useRef } from "react";
import { StyleSheet, Text, View, Button } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

const MAX: number = 10;

export default function App() {
  const [hunger, setHunger] = useState<number>(5);
  const [energy, setEnergy] = useState<number>(5);
  const [mood, setMood] = useState<number>(5);
  const [isLoaded, setIsLoaded] = useState<boolean>(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const avg = (hunger + energy + mood) / 3;
  const isDead = hunger <= 0 || energy <= 0 || mood <= 0;

  let status: string = "I am okay 🙂";

  if (isDead) {
    status = "I am dead 💀";
    if (timerRef.current !== null) clearInterval(timerRef.current!);
  } else if (hunger <= 2) status = "I am hungry 😵‍💫";
  else if (energy <= 2) status = "I am tired 😴";
  else if (mood <= 2) status = "I am sad 😟";
  else if (avg >= 8) status = "I am very happy 😄";

  const restart = async () => {
    await AsyncStorage.removeItem("tamagotchiState");
    setHunger(5);
    setEnergy(5);
    setMood(5);
  };


  useEffect(() => {
    (async () => {
      try {
        const savedState = await AsyncStorage.getItem("tamagotchiState");
        if (savedState) {
          const { hunger: h, energy: e, mood: m } = JSON.parse(savedState);
          setHunger(h);
          setEnergy(e);
          setMood(m);
        }
      } catch (error) {
        console.log("Error loading state:", error);
      } finally {
        setIsLoaded(true);
      }
    })();
  }, []);


  useEffect(() => {
    if (isLoaded) {
      const saveState = async () => {
        try {
          await AsyncStorage.setItem(
            "tamagotchiState",
            JSON.stringify({ hunger, energy, mood }),
          );
        } catch (error) {
          console.log("Error saving state:", error);
        }
      };
      saveState();
    }
  }, [hunger, energy, mood, isLoaded]);


  useEffect(() => {
    if (!isLoaded) return;
    timerRef.current = setInterval(() => {
      setHunger((h) => h - 1);
      setEnergy((e) => e - 1);
      setMood((m) => m - 1);
    }, 5000);

    return () => clearInterval(timerRef.current!);
  }, [isLoaded]);


  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tamagotchi!</Text>

      <Text style={styles.info}>
        Hunger {hunger}/{MAX}
      </Text>
      <Text style={styles.info}>
        Energy {energy}/{MAX}
      </Text>
      <Text style={styles.info}>
        Mood {mood}/{MAX}
      </Text>
      <Text style={styles.info}>{status}</Text>
      {isDead ? (
        <Button title="Restart" onPress={restart} color="#ff0000" />
      ) : (
        <View style={styles.buttons}>
          <Button
            title="Feed" onPress={() => {setHunger(h => h < 10 ? h + 1 : h)}}/>
          <Button title="Sleep" onPress={() => {setEnergy(e => e < 10 ? e + 1 : e)}}/>
          <Button  title="Play" onPress={() => {setMood(m => m < 10 ? m + 1 : m)}}/>
        </View>
      )}
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  info: {
    fontSize: 16,
  },
  buttons: {
    flexDirection: "row",
    marginTop: 16,
    gap: 8,
  },
  status: {
    fontSize: 24,
    fontWeight: "bold",
    marginVertical: 16,
  },
});

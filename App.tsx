import { StatusBar } from 'expo-status-bar';
import { useState, useEffect, useRef } from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';

export default function App() {

  const MAX: number = 10

  const [hunger, setHunger] = useState<number>(5)
  const [energy, setEnergy] = useState<number>(5)
  const [mood, setMood] = useState<number>(5)
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  const avg = (hunger + energy + mood) / 3
  
  let status: string = "I am okay 🙂"
  
  if (hunger <= 0 || energy <= 0 || mood <= 0) {
  status = "I am dead 💀"
  if (timerRef.current !== null) clearInterval(timerRef.current!)
  }
  else if (hunger <= 2) status = "I am hungry 😵‍💫"
  else if (energy <= 2) status = "I am tired 😴"
  else if (mood <=2) status = "I am sad 😟"
  else if (avg>=8) status = "I am very happy 😄"

  useEffect(() => {
      timerRef. current = setInterval(() => {
      setHunger(h => h - 1)
      setEnergy(e => e - 1 )
      setMood(m => m - 1)
    }, 500)
  
    return () => clearInterval(timerRef.current!)
  }, [])
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Tamagotchi!</Text>

      <Text style = {styles.info}>Hunger {hunger}/{MAX}</Text>
      <Text  style = {styles.info}>Energy {energy}/{MAX}</Text>
      <Text  style = {styles.info}>Mood {mood}/{MAX}</Text>
      <Text style = {styles.info}>{status}</Text>

      <view style={styles.buttons}>
      <Button title = "Feed" onPress={() => {setHunger(h => h < 10 ? + 1 : h)}}/>
      <Button title = "Sleep" onPress={() => {setEnergy(e => e < 10 ? + 1 : e)}}/>
      <Button title = "Play" onPress={() => {setMood(m => m < 10 ? + 1: m)}}/>
      </view>

      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: 24, 
    marginBottom: 16
  },
    info:{
    fontSize: 16
  },
  buttons:{
    marginTop: 16,
    gap: 8
  },

});

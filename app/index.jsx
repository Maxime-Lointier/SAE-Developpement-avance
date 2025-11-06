import { StyleSheet, Text, View } from 'react-native'

const Home = () => {//fonction qui retourne un composant visuel
  return (
    <View style={styles.container}>
      <Text>Home</Text>
    </View>
  )
}

export default Home

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  }
})
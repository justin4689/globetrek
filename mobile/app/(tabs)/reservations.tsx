import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet  , Text } from "react-native";





 export  default  function Reservations ()  {


    return (
    <SafeAreaView style= {styles.container}>

 <Text style={{ fontSize: 24, fontWeight: 'bold' }}>Reservations</Text>

    </SafeAreaView>
    )
 }
 

  const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',   
        alignItems: 'center',
        justifyContent: 'center',
    },
  });
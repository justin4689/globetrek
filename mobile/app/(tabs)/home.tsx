import { Colors, Fonts, FontSizes, FontWeight } from "@/utils/constants";
import { StyleSheet, Text, View, Image, TextInput } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Ionicons from '@expo/vector-icons/Ionicons';

export default function Home() {
  return (
    <SafeAreaView style={styles.container}>
       <View style={styles.header}>
          <View style= {styles.headerLeft}>

           <View style= {styles.imageWrapper}>
           <Image
  source={require("../../assets/image/avatar.jpg")}
  resizeMode="cover"
  style={{ width: '100%', height: '100%' }}
/>
            </View>

            <View style= {styles.headerTextContainer}>
            <Text style= {styles.headerText}>Hi <Text style= {{textDecorationLine: "underline",  fontFamily: Fonts.bold,}}>John Doe</Text> 👋</Text>
            <View style= {styles.headerLocationContainer}>
              <Ionicons name="location" size={14} color={"black"} /> 
              <Text style= {styles.headerLocation}>Ivory Coast</Text>
            </View>
           </View>
        </View>
        <View style={styles.headerRight}>
  <View style={styles.bellWrapper}>
    <Ionicons name="notifications-outline" size={32} color="black" />
    <View style={styles.badge}>
      <Text style={styles.badgeText}>3</Text>
    </View>
  </View>
</View>

        
       </View>

       <Text style = {styles.title}>Travelling Today ?</Text>

       <View style={styles.searchSection}>
        <Ionicons name="search"  size={24} style={{ color: "black" }} />
         <TextInput  style= {styles.input} placeholder="Where do you want to go?" /> 
         <View style={styles.optionsWrapper}>
          <Ionicons name="options"  size={24}  color={"white"}/>
         </View>
       
       </View>

       <Text></Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.backgroundColor,
    paddingHorizontal: 16,
    paddingTop :20

  
  },
  header: {
    flexDirection: "row",
    justifyContent:"space-between",
    alignItems: "center"

  } ,

  headerLeft : {
    flexDirection: "row",
    gap : 10

  } , 

  imageWrapper: {

    width : 54 ,
    height: 54,
    borderRadius : 27,
    overflow: "hidden",


  },

  headerTextContainer : {
    flexDirection : "column",
    gap: 5
  } ,

  headerText : {

    fontFamily: Fonts.regular,
    fontSize : FontSizes.medium

  },
  headerLocationContainer: {
    flexDirection: "row"
  } ,

  headerLocation : {
    fontFamily: Fonts.regular,
    color : Colors.tintColor
  } , 

  headerRight: {
  justifyContent: "center",
  alignItems: "center",
},

bellWrapper: {
  position: "relative",
},

badge: {
  position: "absolute",
  top: -2,
  right: -2,
  backgroundColor: Colors.primaryColor,
  width: 16,
  height: 16,
  borderRadius: 8,
  justifyContent: "center",
  alignItems: "center",
},

badgeText: {
  fontFamily: Fonts.regular,
  color: "white",
  fontSize: 10,
  fontWeight: "bold",
},

title: {
  fontFamily: Fonts.bold,
  fontWeight : "700",
   fontSize: FontSizes.xLarge,

   marginTop :30

},

searchSection : {
  flexDirection: "row",
  alignItems: "center",
 
  borderColor: Colors.textColor,
  borderWidth: 1,
  paddingLeft: 5,
  borderRadius: 10,
  marginTop: 20,

},

optionsWrapper : {
  backgroundColor: Colors.primaryColor,
  padding: 10,
  borderBottomRightRadius: 10,
  borderTopRightRadius: 10,
},

input :{
  width:"81%",
  height: "100%",
 
}

});

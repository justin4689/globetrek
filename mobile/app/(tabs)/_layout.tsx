import { Colors } from '@/utils/constants';
import Ionicons from '@expo/vector-icons/Ionicons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs screenOptions={{ tabBarActiveTintColor: Colors.primaryColor , headerShown:false }}>
      <Tabs.Screen
        name="home"
        options={{
          title: 'Home',
          tabBarButtonTestID: 'tab-home',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="home" color={color as string} />,
        }}
      />
      <Tabs.Screen
        name="reservations"
        options={{
          title: 'Reservations',
          tabBarButtonTestID: 'tab-reservations',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="calendar-outline" color={color as string} />,
        }}
      />
        <Tabs.Screen
        name="favorites"
        options={{
          title: 'Favorites',
          tabBarButtonTestID: 'tab-favorites',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="heart-outline" color={color as string} />,
        }}
      />
        <Tabs.Screen
        name="profil"
        options={{
          title: 'Profile',
          tabBarButtonTestID: 'tab-profile',
          tabBarIcon: ({ color }) => <Ionicons size={28} name="person-outline" color={color as string} />,
        }}
      />
    </Tabs>
  );
}

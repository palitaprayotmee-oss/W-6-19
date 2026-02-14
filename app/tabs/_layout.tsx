import { Tabs } from "expo-router";
import {Ionicons} from "@expo/vector-icons"

export default function Laout(){
    return(
        <Tabs>
              <Tabs.Screen 
                  name="index"
                  options={{
                    title:"หน้าแรก",
                    tabBarIcon: () => (
                        <Ionicons name ="home" size={20} color="blue" />

                    ) 
                  }}
              />
        </Tabs>
    )
}
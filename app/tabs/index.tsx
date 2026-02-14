import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView } from "react-native"
import { useCallback, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect } from "expo-router"

type Item = {
  id: string
  brand: string
  size: string
  status: string
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])

  const loadData = async () => {
    const data = await AsyncStorage.getItem("items")
    if (data !== null) {
      setItems(JSON.parse(data))
    }
  }

  useFocusEffect(
    useCallback(() => {
      loadData()
    }, [])
  )

  const deleteItem = async (id: string) => {
    const newItems = items.filter(item => item.id !== id)
    setItems(newItems)
    await AsyncStorage.setItem("items", JSON.stringify(newItems))
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>รายการคำสั่งซื้อ</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{items.length} รายการ</Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20 }}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>ไม่มีข้อมูลในขณะนี้</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.brandText}>{item.brand}</Text>
              <Text style={styles.sizeText}>จำนวน: {item.size}</Text>
              <View style={[
                styles.statusBadge, 
                { backgroundColor: item.status === 'รอดำเนินการ' ? '#FFF9C4' : '#E8F5E9' }
              ]}>
                <Text style={styles.statusText}>{item.status}</Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.deleteBtn,
                { opacity: pressed ? 0.7 : 1 }
              ]}
              onPress={() => deleteItem(item.id)}
            >
              <Text style={styles.deleteBtnText}>ลบ</Text>
            </Pressable>
          </View>
        )}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA" // พื้นหลังสีเทาอ่อนๆ ให้ความรู้สึกสบายตา
  },
  header: {
    paddingHorizontal: 20,
    paddingVertical: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff'
  },
  title: { 
    fontSize: 24, 
    fontWeight: "800", 
    color: "#333" 
  },
  badge: {
    backgroundColor: '#6200EE',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold'
  },
  card: {
    backgroundColor: "#fff",
    marginHorizontal: 16,
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    // Shadow สำหรับ iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    // Shadow สำหรับ Android
    elevation: 3,
  },
  cardInfo: {
    flex: 1,
  },
  brandText: { 
    fontSize: 18, 
    fontWeight: "700", 
    color: "#2D3436",
    marginBottom: 4
  },
  sizeText: { 
    fontSize: 14, 
    color: "#636E72",
    marginBottom: 8
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  statusText: { 
    fontSize: 12, 
    fontWeight: '600',
    color: "#2D3436" 
  },
  deleteBtn: {
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 15,
    paddingVertical: 8,
    borderRadius: 8,
  },
  deleteBtnText: { 
    color: "#D63031", 
    fontWeight: 'bold' 
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 50,
  },
  emptyText: {
    color: '#999',
    fontSize: 16
  }
})
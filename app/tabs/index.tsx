import { View, Text, StyleSheet, FlatList, Pressable, SafeAreaView, StatusBar } from "react-native"
import { useCallback, useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useFocusEffect, useRouter } from "expo-router"

type Item = {
  id: string
  brand: string
  size: string
  status: string
}

export default function Home() {
  const [items, setItems] = useState<Item[]>([])
  const router = useRouter()

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
      {/* ปรับแถบสถานะด้านบนให้เข้ากับธีม */}
      <StatusBar barStyle="dark-content" />
      
      <View style={styles.header}>
        <View>
          <Text style={styles.title}>อาหารอีสาน ✨</Text>
          <Text style={styles.subtitle}>จัดการเมนูที่คุณเลือกไว้</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>{items.length}</Text>
        </View>
      </View>

      <FlatList
        data={items}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={{ fontSize: 50 }}>🌸</Text>
            <Text style={styles.emptyText}>ยังไม่มีรายการเลยจ้า</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.cardInfo}>
              <Text style={styles.brandText}>{item.brand}</Text>
              <Text style={styles.sizeText}>จำนวน: {item.size} จาน</Text>
              
              {/* ปรับสีสถานะตามเงื่อนไข (สีชมพูเข้ม/สีเขียว) */}
              <View style={[
                styles.statusBadge, 
                { backgroundColor: item.status === 'ยังไม่ซื้อ' ? '#FFCCD5' : '#D8F3DC' }
              ]}>
                <Text style={[
                  styles.statusText,
                  { color: item.status === 'ยังไม่ซื้อ' ? '#C9184A' : '#2D6A4F' }
                ]}>
                  ● {item.status}
                </Text>
              </View>
            </View>

            <Pressable
              style={({ pressed }) => [
                styles.deleteBtn,
                { opacity: pressed ? 0.6 : 1 }
              ]}
              onPress={() => deleteItem(item.id)}
            >
              <Text style={styles.deleteBtnText}>ลบ</Text>
            </Pressable>
          </View>
        )}
      />

      {/* ปุ่มเพิ่มรายการแบบลอย (Floating Action Button) */}
      <Pressable 
        style={styles.fab}
       
      >
        <Text style={styles.fabText}>+</Text>
      </Pressable>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFF0F3" // สีชมพูพาสเทลอ่อน (พื้นหลังหลัก)
  },
  header: {
    paddingHorizontal: 24,
    paddingVertical: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: { 
    fontSize: 28, 
    fontWeight: "900", 
    color: "#590D22" 
  },
  subtitle: {
    fontSize: 14,
    color: "#800F2F",
    opacity: 0.6
  },
  badge: {
    backgroundColor: '#FF4D6D',
    width: 35,
    height: 35,
    borderRadius: 18,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: "#FF4D6D",
    shadowOpacity: 0.3,
    shadowRadius: 5,
  },
  badgeText: { color: '#fff', fontWeight: 'bold' },
  listContent: { paddingHorizontal: 16, paddingBottom: 100 },
  card: {
    backgroundColor: "#fff",
    padding: 18,
    borderRadius: 20,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
    // เงาสีชมพูระเรื่อ
    shadowColor: "#FFB3C1",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 10,
    elevation: 4,
  },
  cardInfo: { flex: 1 },
  brandText: { 
    fontSize: 18, 
    fontWeight: "800", 
    color: "#590D22",
    marginBottom: 4
  },
  sizeText: { 
    fontSize: 14, 
    color: "#800F2F",
    marginBottom: 10
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  statusText: { fontSize: 12, fontWeight: '800' },
  deleteBtn: {
    backgroundColor: "#FFE5E5",
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 12,
  },
  deleteBtnText: { 
    color: "#FF4D6D", 
    fontWeight: '800' 
  },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 30,
    backgroundColor: '#FF4D6D',
    width: 65,
    height: 65,
    borderRadius: 33,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 8,
    shadowColor: "#FF4D6D",
    shadowOpacity: 0.4,
    shadowRadius: 10,
  },
  fabText: { color: '#fff', fontSize: 35, fontWeight: '300' },
  emptyContainer: { alignItems: 'center', marginTop: 100 },
  emptyText: { color: '#C48E9B', fontSize: 18, marginTop: 10, fontWeight: '600' }
})
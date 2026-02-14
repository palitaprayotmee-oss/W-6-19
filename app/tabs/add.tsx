import { View, Text, TextInput, StyleSheet, Pressable, KeyboardAvoidingView, Platform, TouchableWithoutFeedback, Keyboard } from "react-native"
import { useState } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { useRouter } from "expo-router"

type Item = {
  id: string
  brand: string
  size: string
  status: string
}

export default function Add() {
  const [brand, setBrand] = useState("")
  const [size, setSize] = useState("")
  const router = useRouter()

  const saveData = async () => {
    if (!brand || !size) {
      alert("กรุณากรอกข้อมูลให้ครบถ้วน");
      return
    }

    const newItem: Item = {
      id: Date.now().toString(),
      brand,
      size,
      status: "ยังไม่ซื้อ",
    }

    const oldData = await AsyncStorage.getItem("items")
    const items: Item[] = oldData ? JSON.parse(oldData) : []

    await AsyncStorage.setItem("items", JSON.stringify([...items, newItem]))

    setBrand("")
    setSize("")

    // 👉 กลับหน้าแรกอัตโนมัติ
    router.back()
  }

  return (
    // KeyboardAvoidingView ช่วยให้แป้นพิมพ์ไม่บังช่องกรอก
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          <Text style={styles.title}>เพิ่มรายการสั่งซื้อ 📝</Text>
          <Text style={styles.subtitle}>กรอกรายละเอียดเมนูที่คุณต้องการด้านล่าง</Text>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>ชื่อเมนู</Text>
            <TextInput
              placeholder="เช่น ข้าวมันไก่, กาแฟดำ"
              placeholderTextColor="#A0A0A0"
              value={brand}
              onChangeText={setBrand}
              style={styles.input}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>จำนวน (จาน/แก้ว)</Text>
            <TextInput
              placeholder="ระบุจำนวนตัวเลข"
              placeholderTextColor="#A0A0A0"
              value={size}
              onChangeText={setSize}
              keyboardType="numeric" // ให้ขึ้นแป้นพิมพ์ตัวเลข
              style={styles.input}
            />
          </View>

          <Pressable 
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? '#0077ED' : '#1e90ff' }
            ]} 
            onPress={saveData}
          >
            <Text style={styles.buttonText}>บันทึกรายการ</Text>
          </Pressable>

          <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelBtnText}>ยกเลิก</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#F8F9FA" 
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "center", // วางเนื้อหาไว้กลางจอ
  },
  title: { 
    fontSize: 28, 
    fontWeight: "800", 
    color: "#2D3436", 
    marginBottom: 8 
  },
  subtitle: {
    fontSize: 16,
    color: "#636E72",
    marginBottom: 32,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    fontWeight: "600",
    color: "#2D3436",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: { 
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    // Shadow สำหรับความนูน
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  button: {
    marginTop: 10,
    padding: 18,
    borderRadius: 15,
    alignItems: "center",
    shadowColor: "#1e90ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 5,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "bold", 
    fontSize: 18 
  },
  cancelBtn: {
    marginTop: 16,
    alignItems: "center",
    padding: 10,
  },
  cancelBtnText: {
    color: "#A0A0A0",
    fontSize: 14,
    fontWeight: "600",
  }
})
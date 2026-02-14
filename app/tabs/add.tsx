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
    router.back()
  }

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
        <View style={styles.inner}>
          {/* ส่วนหัวข้อ */}
          <View style={styles.headerContainer}>
            <Text style={styles.title}>เพิ่มรายการใหม่ ✨</Text>
            <Text style={styles.subtitle}>บันทึกเมนูโปรดของคุณในวันนี้</Text>
          </View>

          {/* ช่องกรอกชื่อเมนู */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>ชื่อเมนู</Text>
            <TextInput
              placeholder="เช่น ชานมไข่มุก, ส้มตำ"
              placeholderTextColor="#C48E9B"
              value={brand}
              onChangeText={setBrand}
              style={styles.input}
            />
          </View>

          {/* ช่องกรอกจำนวน */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>จำนวน (จาน/แก้ว)</Text>
            <TextInput
              placeholder="ใส่จำนวนที่ต้องการ"
              placeholderTextColor="#C48E9B"
              value={size}
              onChangeText={setSize}
              keyboardType="numeric"
              style={styles.input}
            />
          </View>

          {/* ปุ่มบันทึก - สีชมพูเข้มขึ้นเพื่อให้ดูเด่น */}
          <Pressable 
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: pressed ? '#FF85A1' : '#FF4D6D' }
            ]} 
            onPress={saveData}
          >
            <Text style={styles.buttonText}>บันทึกรายการ</Text>
          </Pressable>

          {/* ปุ่มยกเลิก */}
          <Pressable style={styles.cancelBtn} onPress={() => router.back()}>
            <Text style={styles.cancelBtnText}>กลับไปหน้าก่อนหน้า</Text>
          </Pressable>
        </View>
      </TouchableWithoutFeedback>
    </KeyboardAvoidingView>
  )
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: "#FFF0F3" // สีชมพูพาสเทลอ่อนมาก
  },
  inner: {
    padding: 24,
    flex: 1,
    justifyContent: "center",
  },
  headerContainer: {
    marginBottom: 30,
  },
  title: { 
    fontSize: 30, 
    fontWeight: "900", 
    color: "#590D22", // สีน้ำตาลแดงเข้มเพื่อให้ตัดกับชมพู
    marginBottom: 4 
  },
  subtitle: {
    fontSize: 16,
    color: "#800F2F",
    opacity: 0.7,
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 15,
    fontWeight: "700",
    color: "#590D22",
    marginBottom: 8,
    marginLeft: 4,
  },
  input: { 
    backgroundColor: "#fff",
    borderRadius: 16,
    padding: 18,
    fontSize: 16,
    borderWidth: 1.5,
    borderColor: "#FFB3C1", // ขอบสีชมพูอ่อน
    color: "#590D22",
    // Shadow
    shadowColor: "#FFB3C1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 5,
    elevation: 2,
  },
  button: {
    marginTop: 15,
    padding: 18,
    borderRadius: 16,
    alignItems: "center",
    shadowColor: "#FF4D6D",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 8,
    elevation: 6,
  },
  buttonText: { 
    color: "#fff", 
    fontWeight: "800", 
    fontSize: 18,
    letterSpacing: 0.5
  },
  cancelBtn: {
    marginTop: 20,
    alignItems: "center",
    padding: 10,
  },
  cancelBtnText: {
    color: "#C9184A",
    fontSize: 14,
    fontWeight: "600",
    textDecorationLine: 'underline'
  }
})
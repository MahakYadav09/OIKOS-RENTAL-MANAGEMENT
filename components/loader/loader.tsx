import { View, Text, ActivityIndicator, StyleSheet, Modal } from 'react-native'
import React from 'react'

const Loader = ({visible, title}:any) => {
    return (
        <Modal transparent animationType="fade" visible={visible}>
      <View
        style={{
          flex: 1,
          backgroundColor: "rgba(0,0,0,0.5)", // 👈 halka black + transparent
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <ActivityIndicator size="large" color="#fff" />
        <Text style={{fontSize:16,color:'white',fontWeight:600, marginTop:10}}>{title}</Text>
      </View>
    </Modal>
    )
}

export default Loader

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.05)',
        justifyContent: "center",
        alignItems: "center",
    }
})
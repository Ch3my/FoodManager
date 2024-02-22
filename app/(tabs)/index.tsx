import { StyleSheet, Button, FlatList, Animated, Pressable, Alert } from 'react-native';

import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';

import EditScreenInfo from '@/components/EditScreenInfo';
import { Text, View, IconButton, useThemeColor } from '@/components/Themed';
import { supabase } from '../../utils/supabase'
import { Food } from '../../types/food'
import { useCallback, useEffect, useState } from 'react';
import { MonoText } from "@/components/StyledText"
import Swipeable from 'react-native-gesture-handler/Swipeable';
import { router, useFocusEffect } from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome';


export default function TabOneScreen() {
  const [foodList, setFoodList] = useState<Food[] | null>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)

  useFocusEffect(
    useCallback(() => {
      getFoodList();
    }, [])
    // Para que no es necesario especificar nada en []
  );

  async function getFoodList() {
    setRefreshing(true)

    const { data, error, status } = await supabase.from("foods").select();

    if (error) {
      console.error("Error fetching data:", error.message);
      return
    }
    setFoodList(data);
    setRefreshing(false)
  }

  type ItemProps = { food: Food };

  const deleteFood = async (id: number) => {
    // TODO. Preguntar por Confirmacion
    // console.log("DELETE")
    const { error } = await supabase
      .from('foods')
      .delete()
      .eq('id', id)

    if (error) {
      Alert.alert("Error", error.message)
      return
    }
    getFoodList()
    Alert.alert("Exito!", "Eliminado correctamente")
  }

  const rightSwipe = (progress: any, dragX: any, id: number) => {
    const translateDelete = progress.interpolate({
      inputRange: [0, 1],
      outputRange: [50, 1],
      extrapolate: 'clamp',
    });
    return (
      <View style={{ flexDirection: 'row', width: 50 }}>
        <Animated.View style={{
          justifyContent: 'center',
          alignItems: 'center',
          transform: [{ translateX: translateDelete }],
          backgroundColor: "red",
          width: 50
        }}>
          <Pressable onPress={() => deleteFood(id)} >
            {({ pressed }) => (
              <FontAwesome
                size={25}
                color={"white"}
                name={"trash"}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Animated.View>
      </View>
    )
  }

  function formatDate(date: Date): string {
    if (typeof date == "string") {
      return date
    }
    const year = date.getFullYear();
    const month = ('0' + (date.getMonth() + 1)).slice(-2); // Adding 1 because getMonth() returns zero-based index
    const day = ('0' + date.getDate()).slice(-2);
    return `${year}-${month}-${day}`;
  }

  const Item = ({ food }: ItemProps) => {
    const today = new Date();
    let color = useThemeColor({ light: "black", dark: "white" }, 'text');
    
    if(new Date(food.bestBy) <= today) {
      color = "red"
    }

    return (
      <Swipeable
        renderRightActions={(progress, dragX) => rightSwipe(progress, dragX, food.id)}
      >
        <Pressable onPress={() => { router.push(`/foods/edit/${food.id}`) }}>
          <View style={{ flex: 1, flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomColor: "white", borderBottomWidth: 1 }}>
            <MonoText style={{ color }}>{food.codSeguimiento}</MonoText>
            <Text style={{ color }}>{food.name}</Text>
            <Text style={{ color }}>{formatDate(food.bestBy)}</Text>
          </View>
        </Pressable>
      </Swipeable>
    );
  }

  return (
    <View style={{ padding: 10 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <IconButton iconName='plus'
          onPress={() => router.push("/foods/new-food")} />
        <IconButton iconName='refresh'
          onPress={() => getFoodList()} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomColor: "white", borderBottomWidth: 1 }}>
        <Text>Cod</Text>
        <Text>Nombre</Text>
        <Text>Fec Venc</Text>
      </View>
      <FlatList
        onRefresh={getFoodList}
        refreshing={refreshing}
        data={foodList}
        renderItem={({ item }) => <Item food={item} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
});

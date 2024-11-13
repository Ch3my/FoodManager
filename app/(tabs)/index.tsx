import { StyleSheet, FlatList, Pressable, Alert } from 'react-native';
import { Text, View, IconButton, useThemeColor } from '@/components/Themed';
import { supabase } from '../../utils/supabase'
import { Food } from '../../types/food'
import { useCallback, useEffect, useState } from 'react';
import { MonoText } from "@/components/StyledText"
import { router, useFocusEffect } from "expo-router"
import FontAwesome from '@expo/vector-icons/FontAwesome';
import formatDate from '@/utils/format-date';
import { printToFile } from '@/utils/print-to-file';

import Reanimated, { Extrapolation, interpolate, useAnimatedStyle } from "react-native-reanimated";
import ReanimatedSwipeable from "react-native-gesture-handler/ReanimatedSwipeable";
import React from 'react';

type ItemProps = { 
  food: Food; 
  deleteFood: (id: number) => void;
};

export default function TabOneScreen() {
  const [foodList, setFoodList] = useState<Food[] | null>([])
  const [refreshing, setRefreshing] = useState<boolean>(false)

  useFocusEffect(
    useCallback(() => {
      getFoodList();
    }, [])
    // Para que no es necesario especificar nada en []
  );

  const getFoodList = useCallback(async () => {
    setRefreshing(true);

    const { data, error } = await supabase.from("foods").select()
      .order('bestBy', { ascending: true });

    if (error) {
      console.error("Error fetching data:", error.message);
      setRefreshing(false);
      return;
    }
    setFoodList(data || []);
    setRefreshing(false);
  }, []);


  const deleteFood = useCallback(async (id: number) => {
    const { error } = await supabase
      .from('foods')
      .delete()
      .eq('id', id);

    if (error) {
      Alert.alert("Error", error.message);
      return;
    }
    getFoodList();
    Alert.alert("Success!", "Deleted successfully");
  }, [getFoodList]);

  const print = useCallback(() => {
    if (foodList == null) {
      return
    }
    // Construir HTML
    let html = `
    <style>
      table {
        font-size: 14px; /* Setting font size for the entire page */
      }
      @page {
        size: landscape;
        margin: 10mm;
      }
      table {
          width: 100%;
          border-collapse: collapse;
      }
      th, td {
          border: 1px solid black;
          padding: 4px;
          text-align: left;
      }
    </style>`
    html += `
    <table>
        <colgroup>
        <col style="width: 10%;"> 
        <col style="width: 26.66%;"> 
        <col style="width: 9%;"> 
        <col style="width: 11.66%;"> 
        <col style="width: 11.66%;">
        <col style="width: 29.66%;">
        </colgroup>
        <thead>
            <tr>
                <th>Codigo</th>
                <th>Nombre</th>
                <th>Cantidad</th>
                <th>Fec. Guardado</th>
                <th>Fecha Venc</th>
                <th>Notas</th>
            </tr>
        </thead>
        <tbody>`

    for (let d of foodList) {
      const today = new Date();
      let vencido = false
      if (new Date(d.bestBy) <= today) {
        vencido = true
      }

      html += `
      <tr>
        <td>${d.codSeguimiento}</td>
        <td>${d.name}</td>
        <td>${d.cantidad}</td>
        <td>${formatDate(d.dateSaved)}</td>
        <td>${formatDate(d.bestBy)}</td>`

      html += `<td>`
      if (vencido) {
        html += "** VENCIDO ** "
      }
      html += `${d.notes}</td>`
      html += `</tr>`
    }

    html += `</tbody></table>`
    // pasar a printToFile
    printToFile(html)
  }, [foodList]);

  const rightSwipe = (progress: any, dragX: any, id: number) => {
    const deleteStyle = useAnimatedStyle(() => {
      const translateX = interpolate(
          progress.value,
          [0, 1],
          [50, 1],
          Extrapolation.CLAMP
      );
      return {
          transform: [{ translateX }],
          width: 50
      };
  });

    return (
      <View style={{ flexDirection: 'row', width: 50 }}>
        <Reanimated.View style={deleteStyle}>
          <Pressable style={{
            flex: 1, justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: "red"
          }} onPress={() => deleteFood(id)} >
            {({ pressed }) => (
              <FontAwesome
                size={25}
                color={"white"}
                name={"trash"}
                style={{ opacity: pressed ? 0.5 : 1 }}
              />
            )}
          </Pressable>
        </Reanimated.View>
      </View>
    )
  }

  const Item = React.memo(({ food, deleteFood }: ItemProps) => {
    const today = new Date();
    let color = useThemeColor({ light: "black", dark: "white" }, 'text');
  
    if (new Date(food.bestBy) <= today) {
      color = "red";
    }
  
    const rightSwipe = (progress: any, dragX: any) => {
      const deleteStyle = useAnimatedStyle(() => {
        const translateX = interpolate(
          progress.value,
          [0, 1],
          [50, 1],
          Extrapolation.CLAMP
        );
        return {
          transform: [{ translateX }],
          width: 50
        };
      });
  
      return (
        <View style={{ flexDirection: 'row', width: 50 }}>
          <Reanimated.View style={deleteStyle}>
            <Pressable style={{
              flex: 1, justifyContent: 'center',
              alignItems: 'center',
              backgroundColor: "red"
            }} onPress={() => deleteFood(food.id)} >
              {({ pressed }) => (
                <FontAwesome
                  size={25}
                  color={"white"}
                  name={"trash"}
                  style={{ opacity: pressed ? 0.5 : 1 }}
                />
              )}
            </Pressable>
          </Reanimated.View>
        </View>
      );
    };
  
    return (
      <ReanimatedSwipeable
        renderRightActions={rightSwipe}
        friction={1}
      >
        <Pressable onPress={() => { router.push(`/foods/edit/${food.id}`) }}>
          <View style={{
            flexDirection: 'row', justifyContent: "space-between",
            padding: 10, borderBottomColor: "white", borderBottomWidth: 1,
            gap: 10
          }}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 10, flex: 1 }}>
              <MonoText style={{ color }}>{food.codSeguimiento}</MonoText>
              <Text style={{ color, flexShrink: 1 }} ellipsizeMode="tail" numberOfLines={1}>{food.name}</Text>
            </View>
            <View style={{ flexDirection: 'row', gap: 10 }}>
              <Text style={{ color }}>{food.cantidad}</Text>
              <Text style={{ color }}>{formatDate(food.bestBy)}</Text>
            </View>
          </View>
        </Pressable>
      </ReanimatedSwipeable>
    );
  });

  const renderItem = useCallback(({ item }: { item: Food }) => (
    <Item food={item} deleteFood={deleteFood} />
  ), [deleteFood]);

  return (
    <View style={{ padding: 10, flex: 1 }}>
      <View style={{ flexDirection: "row", gap: 10 }}>
        <IconButton iconName='plus'
          onPress={() => router.push("/foods/new-food")} />
        <IconButton iconName='refresh' onPress={() => getFoodList()} />
        <IconButton iconName='print' onPress={() => print()} />
      </View>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', padding: 10, borderBottomColor: "white", borderBottomWidth: 1 }}>
        <Text>Cod</Text>
        <Text>Nombre</Text>
        <Text>Cant</Text>
        <Text>Fec Venc</Text>
      </View>
      <FlatList
        onRefresh={getFoodList}
        refreshing={refreshing}
        data={foodList}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderItem}
      />
    </View>
  );
}

const styles = StyleSheet.create({
});

import { Text, View, TextInput, IconButton, ScrollView } from '@/components/Themed';
import { Stack, useLocalSearchParams } from "expo-router";
import { Alert } from 'react-native';
import { supabase } from '../../../utils/supabase'
import { useEffect, useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function EditFood() {
    const { id } = useLocalSearchParams();

    const [foodName, setFoodName] = useState<string>("")
    const [foodCodigo, setFoodCodigo] = useState<string>("")
    const [foodNotes, setFoodNotes] = useState<string>("")
    const [cantidad, setCantidad] = useState<number>(1)
    const [showDateSavedPicker, setShowDateSavedPicker] = useState<boolean>(false)
    const [dateSaved, setDateSaved] = useState<Date>(new Date())
    const [showBestByPicker, setShowBestByPicker] = useState<boolean>(false)
    const [bestBy, setBestBy] = useState<Date>(new Date())

    useEffect(() => {
        getFood()
    }, []);

    async function getFood() {
        const { data, error, status } = await supabase
            .from("foods").select()
            .eq("id", id).single()

        if (error) {
            console.error("Error fetching data:", error.message);
            return
        }
        setFoodCodigo(data.codSeguimiento)
        setFoodName(data.name)
        setDateSaved(new Date(data.dateSaved))
        setBestBy(new Date(data.bestBy))
        setCantidad(data.cantidad)
        setFoodNotes(data.notes)
    }

    const saveFood = async () => {
        if (foodName == "") {
            Alert.alert("Alerta", "El nombre o descripcion es obligatorio" + foodName)
            return
        }
        const { error } = await supabase
            .from('foods')
            .update({
                codSeguimiento: foodCodigo,
                name: foodName,
                dateSaved,
                bestBy,
                cantidad,
                notes: foodNotes
            })
            .eq("id", id).single()
        if (error) {
            Alert.alert("Error", error.message)
            return
        }
        Alert.alert("Exito!", "Guardado correctamente")
    }


    const onChangeDateSaved = (e: DateTimePickerEvent, date?: Date) => {
        setShowDateSavedPicker(!showDateSavedPicker)
        if (e.type == "set" && date) {
            setDateSaved(date)
        }
    }
    const onChangeBestBy = (e: DateTimePickerEvent, date?: Date) => {
        setShowBestByPicker(!showBestByPicker)
        if (e.type == "set" && date) {
            setBestBy(date)
        }
    }

    const onChangeCantidad = (txt: string) => {
        if (txt == "") {
            setCantidad(0)
            return
        }
        setCantidad(parseInt(txt))
    }

    return (
        <ScrollView style={{ padding: 10 }}>
            <Stack.Screen options={{ headerTitle: "Editar Comida", headerTitleStyle: { color: "white" }, headerStyle: { backgroundColor: "black" }, headerTintColor: "white" }} />
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <IconButton onPress={saveFood} iconName='save' />
            </View>
            <Text>Código</Text>
            <TextInput style={{ marginBottom: 10 }} onChangeText={setFoodCodigo} value={foodCodigo}
                autoCapitalize="characters" editable={false} />
            <Text>Nombre</Text>
            <TextInput style={{ marginBottom: 10 }} onChangeText={setFoodName} value={foodName} />
            <Text>Cantidad</Text>
            <TextInput style={{ marginBottom: 10 }}
                value={cantidad.toString()} keyboardType='numeric'
                onChangeText={onChangeCantidad} />
            <Text>Fecha Guardado</Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <TextInput editable={false} style={{ flex: 1 }} value={dateSaved.toLocaleDateString()} />
                <IconButton iconName='search' onPress={() => {
                    setShowDateSavedPicker(true)
                }} />
                {showDateSavedPicker &&
                    <DateTimePicker mode="date" value={dateSaved}
                        display="default" onChange={onChangeDateSaved} />
                }
            </View>
            <Text>Fecha Vencimiento</Text>
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <TextInput editable={false} style={{ flex: 1 }} value={bestBy.toLocaleDateString()} />
                <IconButton iconName='search' onPress={() => {
                    setShowBestByPicker(true)
                }} />
                {showBestByPicker &&
                    <DateTimePicker mode="date" value={bestBy}
                        display="default" onChange={onChangeBestBy} />
                }
            </View>
            <TextInput style={{ marginBottom: 10 }}
                onChangeText={setFoodNotes} value={foodNotes}
                numberOfLines={3} multiline />

        </ScrollView>
    )
}
import { Text, View, TextInput, IconButton } from '@/components/Themed';
import { Stack } from "expo-router";
import { Alert } from 'react-native';
import { supabase } from '../../utils/supabase'
import { useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function NewFood() {
    const [foodName, setFoodName] = useState<string>("")
    const [foodCodigo, setFoodCodigo] = useState<string>("")
    const [cantidad, setCantidad] = useState<number>(1)
    const [showDateSavedPicker, setShowDateSavedPicker] = useState<boolean>(false)
    const [showBestByPicker, setShowBestByPicker] = useState<boolean>(false)
    const [dateSaved, setDateSaved] = useState<Date>(new Date())
    const [bestBy, setBestBy] = useState<Date>(new Date())

    const saveFood = async () => {
        if (foodName == "") {
            Alert.alert("Alerta", "El nombre o descripcion es obligatorio" + foodName)
            return
        }
        const { data, error, status } = await supabase
            .from('foods')
            .insert([{
                codSeguimiento: foodCodigo,
                name: foodName,
                dateSaved,
                bestBy,
                cantidad
            }])
            .single();
        if (error) {
            Alert.alert("Error", "Error al guardar en Base de Datos")
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
        <View style={{ padding: 10 }}>
            <Stack.Screen options={{ headerTitle: "Agregar Comida" }} />
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <IconButton onPress={saveFood} iconName='save' />
            </View>
            <Text>Código</Text>
            <TextInput style={{ marginBottom: 10 }} onChangeText={setFoodCodigo} value={foodCodigo}
                autoCapitalize="characters" />
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
        </View>
    )
}
import { Text, View, TextInput, IconButton } from '@/components/Themed';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Stack, router, useLocalSearchParams } from "expo-router";
import { Alert, Pressable } from 'react-native';
import Colors from '@/constants/Colors';
import { useColorScheme } from '@/components/useColorScheme';
import { supabase } from '../../../utils/supabase'
import { useEffect, useState } from 'react';
import DateTimePicker, { DateTimePickerEvent } from '@react-native-community/datetimepicker';

export default function EditFood() {
    const { id } = useLocalSearchParams();

    const colorScheme = useColorScheme();
    const [foodName, setFoodName] = useState<string>("")
    const [foodCodigo, setFoodCodigo] = useState<string>("")
    const [diasDuracion, setDiasDuracion] = useState<number>(60)
    const [showDateSavedPicker, setShowDateSavedPicker] = useState<boolean>(false)
    const [dateSaved, setDateSaved] = useState<Date>(new Date())
    const [bestBy, setBestBy] = useState<Date>(new Date())


    useEffect(() => {
        calculateBestByDate()
    }, [dateSaved, diasDuracion]);

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
        setDiasDuracion(data.bestDays)
        setDateSaved(new Date(data.dateSaved))
        setBestBy(new Date(data.bestBy))
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
                bestDays: diasDuracion
            })
            .eq("id", id).single()
        if (error) {
            Alert.alert("Error", error.message)
            return
        }
        Alert.alert("Exito!", "Guardado correctamente")
    }

    // Function to calculate bestBy date
    const calculateBestByDate = () => {
        const newBestByDate = new Date(dateSaved); // Create a new Date object based on dateSaved
        newBestByDate.setDate(newBestByDate.getDate() + diasDuracion); // Add diasDuracion days to the date
        setBestBy(newBestByDate); // Update bestBy state with the new date value
    };

    const onChangeDateSaved = (e: DateTimePickerEvent, date?: Date) => {
        setShowDateSavedPicker(!showDateSavedPicker)
        if (e.type == "set" && date) {
            setDateSaved(date)
        }
    }

    const onChangeDiasDuracion = (txt: string) => {
        if (txt == "") {
            setDiasDuracion(0)
            return
        }
        setDiasDuracion(parseInt(txt))
    }

    return (
        <View style={{ padding: 10 }}>
            <Stack.Screen options={{ headerTitle: "Editar Comida" }} />
            <View style={{ flexDirection: "row", gap: 10, marginBottom: 10 }}>
                <IconButton onPress={saveFood} iconName='save' />
            </View>
            <Text>Código</Text>
            <TextInput style={{ marginBottom: 10 }} onChangeText={setFoodCodigo} value={foodCodigo}
                autoCapitalize="characters" editable={false} />
            <Text>Nombre</Text>
            <TextInput style={{ marginBottom: 10 }} onChangeText={setFoodName} value={foodName}></TextInput>
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
            <Text>Dias Duración</Text>
            <TextInput style={{ marginBottom: 10 }}
                value={diasDuracion.toString()}
                onChangeText={onChangeDiasDuracion} />
            <Text>Fecha Vencimiento</Text>
            <TextInput editable={false} value={bestBy.toLocaleDateString()} />
        </View>
    )
}
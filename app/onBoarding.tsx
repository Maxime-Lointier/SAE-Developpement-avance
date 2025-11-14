import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import "./global.css"

// --- Configuration de l'API ---
const API_KEY = "53ca552e5058570f5131bc1817ad1ee5";
const API_BASE_URL = 'https://api.themoviedb.org/3';

interface Genre {
    name: string;
    id: number;
}


const onBoarding = () => {

    const [genre, setGenre] = useState<Genre[]>([]);

    useEffect(()=>{
        //fetch les différents genres
        fetchGenre();
    }, [])
    
    async function fetchGenre(){
    
        try {
            const response = await fetch(`${API_BASE_URL}/genre/movie/list?api_key=${API_KEY}&language=fr-FR`);
            const data = await response.json();
            
            setGenre(data.genres);

            console.log(data);
        }
    
        catch(e){
            console.log(e);
        }
    }
    
    return (
        <ScrollView style={{backgroundColor:"#0f0f1e", flex: 1}}>
            <View style={{ maxWidth: 400, alignSelf: 'center', width: '100%', paddingHorizontal: 16 }}>

                //Text : Title
                <Text style={{color: "white", fontWeight: "bold", fontSize: 30, textAlign: "center", marginBottom: 8}}>
                    Vos genres préférés
                </Text>

                //Text : Description
                <Text style={{color: "#99a0ac", fontSize: 16, textAlign: "center", marginBottom: 24}}>
                    Selectionnez au moins 3 genres pour personnaliser vos recommandations
                </Text>

                //Button : Genre
                <View style={{ flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between' }}>
                    {genre.map((genre) => {
                        return (
                            <Pressable 
                                key={genre.id} 
                                style={{
                                    backgroundColor: "#1f1f37",
                                    padding: 16,
                                    margin: 4,
                                    borderRadius: 16,
                                    width: '48%',
                                    minHeight: 100,
                                    justifyContent: 'center',
                                    alignItems: 'center'
                                }}
                            >
                                //Logo : Movie
                                <Image 
                                    source={{ uri: "https://img.icons8.com/sf-black/64/movie.png" }}
                                    style={{ width: 32, height: 32, marginBottom: 8, tintColor: 'white' }}
                                />

                                //Text: Genre Name
                                <Text style={{ color: 'white', textAlign: 'center', fontWeight: '600', fontSize: 16 }}>
                                    {genre.name}
                                </Text>

                            </Pressable>
                        );
                    })}
                </View>

                //Text : Number of genres selected
                <Text style={{color: "white", textAlign: "center", marginTop: 16, marginBottom: 8}}>
                    0/3 genres selectionnés
                </Text>

                //Button : Continue
                <Pressable>
                    <Text style={{color: "white", textAlign: "center"}}>Continuer</Text>
                </Pressable>
            </View>
        </ScrollView> 
    )
}

export default onBoarding

const styles = StyleSheet.create({})
import { Link } from "expo-router";
import { useEffect, useState } from "react";
import { Image, Pressable, ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, { useSharedValue, useAnimatedStyle, withTiming, interpolateColor } from "react-native-reanimated";
import "./global.css"

// --- Configuration de l'API ---
const API_KEY = "53ca552e5058570f5131bc1817ad1ee5";
const API_BASE_URL = 'https://api.themoviedb.org/3';

interface Genre {
    name: string;
    id: number;
}

// Colors for each genre
const genreColors = {
    28: '#E53935',    // Action (Rouge vif)
    12: '#00897B',    // Aventure (Vert/Bleu)
    16: '#1E88E5',    // Animation (Bleu vif)
    35: '#FBC02D',    // Comédie (Jaune/Or)
    80: '#455A64',    // Crime (Gris-bleu foncé)
    99: '#6D4C41',    // Documentaire (Marron terre)
    18: '#5E35B1',    // Drame (Violet profond)
    10751: '#EC407A', // Familial (Rose)
    14: '#8E24AA',    // Fantastique (Violet magique)
    36: '#A1887F',    // Histoire (Sépia)
    27: '#B71C1C',    // Horreur (Rouge sang)
    10402: '#D81B60', // Musique (Magenta)
    9648: '#004D40',  // Mystère (Vert forêt sombre)
    10749: '#C2185B', // Romance (Rose foncé)
    878: '#546E7A',  // Science-Fiction (Gris "métal")
    10770: '#757575', // Téléfilm (Gris neutre)
    53: '#37474F',    // Thriller (Gris très sombre)
    10752: '#556B2F', // Guerre (Vert olive)
    37: '#8D6E63',    // Western (Brun "poussière")
};

// Default color for genres not found in genreColors
const defaultColor = '#9E9E9E'; // Grey

// Fonction pour assombrir une couleur hex
const darkenColor = (color: string, percent: number) => {
    const num = parseInt(color.replace("#", ""), 16);
    const amt = Math.round(2.55 * percent);
    const R = Math.max(0, Math.min(255, (num >> 16) - amt));
    const G = Math.max(0, Math.min(255, ((num >> 8) & 0x00FF) - amt));
    const B = Math.max(0, Math.min(255, (num & 0x0000FF) - amt));
    return `#${(0x1000000 + R * 0x10000 + G * 0x100 + B).toString(16).slice(1)}`;
};

// Composant GenreButton avec animation
const GenreButton = ({ 
    genre, 
    backgroundColorGenre, 
    isSelected, 
    onPress 
}: { 
    genre: Genre; 
    backgroundColorGenre: string; 
    isSelected: boolean; 
    onPress: () => void;
}) => {
    const [isPressed, setIsPressed] = useState(false);
    const progress = useSharedValue(isSelected ? 1 : 0);
    const darkColor = darkenColor(backgroundColorGenre, 20);

    // Ne déclencher l'animation que si le bouton n'est pas pressé
    useEffect(() => {
        if (!isPressed) {
            progress.value = withTiming(isSelected ? 1 : 0, {
                duration: 300,
            });
        }
    }, [isSelected, isPressed]);

    const animatedStyle = useAnimatedStyle(() => {
        const backgroundColor = interpolateColor(
            progress.value,
            [0, 1],
            [backgroundColorGenre, darkColor]
        );
        return {
            backgroundColor,
        };
    });

    return (
        <Pressable 
            onPress={onPress} 
            onPressIn={() => setIsPressed(true)}
            onPressOut={() => {
                setIsPressed(false);
                // Déclencher l'animation après le relâchement
                progress.value = withTiming(isSelected ? 1 : 0, {
                    duration: 300,
                });
            }}
            style={styles.genrePressable}
        >
            {({ pressed }) => (
                <Animated.View style={[
                    styles.genreButton,
                    animatedStyle,
                    pressed && { backgroundColor: darkColor }
                ]}>
                    {/* Logo : Movie */}
                    <Image 
                        source={{ uri: "https://img.icons8.com/sf-black/64/movie.png" }}
                        style={{ width: 32, height: 32, marginBottom: 8, tintColor: 'white' }}
                    />

                    {/* Text: Genre Name */}
                    <Text style={{ color: 'white', fontWeight: '600', fontSize: 16 }}>
                        {genre.name}
                    </Text>
                </Animated.View>
            )}
        </Pressable>
    );
};

const onBoarding = () => {

    const [genre, setGenre] = useState<Genre[]>([]);
    const [selectedGenres, setSelectedGenres] = useState<number[]>([]);

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

    const toggleGenre = (genreId: number) => {
        setSelectedGenres(prev => {
            if (prev.includes(genreId)) {
                // Si déjà sélectionné, on le retire
                return prev.filter(id => id !== genreId);
            } else {
                // Sinon, on l'ajoute
                return [...prev, genreId];
            }
        });
    }
    
    return (
        <ScrollView style={{backgroundColor:"#0f0f1e", flex: 1}}>
            <View style={{ maxWidth: 400, alignSelf: 'center', width: '100%', paddingHorizontal: 16 }}>
                {/* Text : Title */}
                <Text style={{color: "white", fontWeight: "bold", fontSize: 30, textAlign: "center", marginBottom: 8}}>
                    Vos genres préférés
                </Text>

                {/* Text : Description */}
                <Text style={{color: "#99a0ac", fontSize: 16, textAlign: "center", marginBottom: 24}}>
                    Selectionnez au moins 3 genres pour personnaliser vos recommandations
                </Text>

                {/* Button : Genre */}
                <View style={styles.genreContainer}>
                    {genre.length > 0 ? genre.map((genre) => {
                        const backgroundColorGenre = genreColors[genre.id as keyof typeof genreColors] || defaultColor;
                        const isSelected = selectedGenres.includes(genre.id);
                        
                        return (
                            <GenreButton
                                key={genre.id}
                                genre={genre}
                                backgroundColorGenre={backgroundColorGenre}
                                isSelected={isSelected}
                                onPress={() => toggleGenre(genre.id)}
                            />
                        );
                    }) : (
                        <Text style={{ color: 'white', textAlign: 'center', width: '100%' }}>Chargement des genres...</Text>
                    )}
                </View>

                {/* Text : Number of genres selected */}
                <Text style={{color: "white", textAlign: "center", marginTop: 16, marginBottom: 8}}>
                    {selectedGenres.length}/3 genres selectionnés
                </Text>

                {/* Button : Continue */}
                <Pressable>
                    <Text style={{color: "white", textAlign: "center"}}>Continuer</Text>
                </Pressable>
            </View>
        </ScrollView> 
    )
}

export default onBoarding

const styles = StyleSheet.create({
    genreContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        gap: 10,
    },
    genrePressable: {
        width: '48%',
        marginBottom: 12,
    },
    genreButton: {
        padding: 16,
        borderRadius: 16,
        height: 120,
        width: '100%',
    },
})


/*

*/
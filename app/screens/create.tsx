import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { router } from "expo-router";
import { DukaContext } from "@/app/context/DukaContext";
import styles from "@/app/styles";

const CreatePostScreen = () => {
    const [title, setTitle] = useState("");
    const [body, setBody] = useState("");
    const [userId] = useState(1); // Default user ID

    const dukaContext = useContext(DukaContext);

    if (!dukaContext) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Context not found. Ensure DukaProvider is wrapped around this component.</Text>
            </View>
        );
    }

    const { addpost } = dukaContext;

    const handleSubmit = () => {
        if (!title.trim() || !body.trim()) {
            Alert.alert("Error", "Title and body cannot be empty.");
            return;
        }

        addpost({ title, body, userId });
        router.back();
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
            <TextInput style={[styles.input, styles.bodyInput]} placeholder="Body" value={body} onChangeText={setBody} multiline numberOfLines={4} />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
};

export default CreatePostScreen;

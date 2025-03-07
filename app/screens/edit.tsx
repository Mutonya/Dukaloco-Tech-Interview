import { useState, useContext } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert } from "react-native";
import { useLocalSearchParams, router } from "expo-router";
import { DukaContext } from "@/app/context/DukaContext";
import { useToast } from "@/app/components/ToastContext";
import styles from "@/app/styles";

export default function EditPostScreen() {
    const { id } = useLocalSearchParams<{ id: string }>();
    const dukaContext = useContext(DukaContext);
    const { showToast } = useToast(); // Use the useToast hook

    if (!dukaContext) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Context not found.</Text>
            </View>
        );
    }

    const { blogPosts, updatePost } = dukaContext;
    const post = blogPosts.find((p) => p.id === Number(id));

    const [title, setTitle] = useState(post?.title || "");
    const [body, setBody] = useState(post?.body || "");

    const handleSubmit = async () => {
        if (!title.trim() || !body.trim()) {
            Alert.alert("Error", "Title and body cannot be empty.");
            return;
        }

        try {
            await updatePost(Number(id), { id: Number(id), title, body, userId: post?.userId || 1 });
            showToast("Post updated successfully!", "success"); // Show success toast
            router.replace("/");
        } catch (error) {
            showToast("Failed to update post.", "error"); // Show error toast
        }
    };

    return (
        <View style={styles.container}>
            <TextInput style={styles.input} placeholder="Title" value={title} onChangeText={setTitle} />
            <TextInput style={[styles.input, styles.bodyInput]} placeholder="Body" value={body} onChangeText={setBody} multiline />
            <TouchableOpacity style={styles.button} onPress={handleSubmit}>
                <Text style={styles.buttonText}>Submit</Text>
            </TouchableOpacity>
        </View>
    );
}
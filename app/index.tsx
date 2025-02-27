import { FlatList, Text, TouchableOpacity, View, ActivityIndicator, Alert } from "react-native";
import { useContext } from "react";
import { DukaContext } from "@/app/context/DukaContext";
import { useRouter } from "expo-router";
import { AntDesign } from "@expo/vector-icons";
import styles from "@/app/styles";

export default function Index() {
    const router = useRouter();
    const dukaContext = useContext(DukaContext);

    if (!dukaContext) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>Context not found.</Text>
            </View>
        );
    }

    const { blogPosts, deletepost, currentUser, loading, error } = dukaContext;

    const handleDelete = (id: number) => {
        Alert.alert("Delete Post", "Are you sure you want to delete this post?", [
            { text: "Cancel", style: "cancel" },
            { text: "Delete", onPress: () => deletepost(id), style: "destructive" },
        ]);
    };

    return (
        <View style={styles.container}>
            {loading ? (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#000" />
                </View>
            ) : error ? (
                <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error}</Text>
                </View>
            ) : (
                <FlatList
                    data={blogPosts}
                    keyExtractor={(item) => `${item.id}`}
                    renderItem={({ item }) => (
                        <View style={styles.card}>
                            <Text style={styles.postTitle}>{item.title}</Text>
                            <Text style={styles.postBody}>{item.body}</Text>

                            <View style={styles.actions}>
                                <TouchableOpacity style={styles.button} onPress={() => router.push(`/screens/edit?id=${item.id}`)}>
                                    <Text style={styles.buttonText}>Edit</Text>
                                </TouchableOpacity>

                                {currentUser?.id === 1 && (
                                    <TouchableOpacity style={styles.button} onPress={() => handleDelete(item.id)}>
                                        <Text style={styles.buttonText}>Delete</Text>
                                    </TouchableOpacity>
                                )}
                            </View>
                        </View>
                    )}
                />
            )}

            {/* FAB */}
            <TouchableOpacity style={styles.fab} onPress={() => router.push("/screens/create")}>
                <AntDesign name="plus" size={24} color="white" />
            </TouchableOpacity>
        </View>
    );
}

import {FlatList, Text, TouchableOpacity, View, StyleSheet, ActivityIndicator} from "react-native";
import { useContext } from "react";
import { DukaContext } from "@/app/context/DukaContext";
import { Link } from "expo-router";

export default function Index() {
    const { blogPosts, deletepost, currentUser,loading,error } = useContext(DukaContext);



    if (loading) {
        return (
            <View style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#0000ff" />
            </View>
        );
    }

    if (error) {
        return (
            <View style={styles.errorContainer}>
                <Text style={styles.errorText}>{error}</Text>
            </View>
        );
    }


    return (
        <FlatList
            data={blogPosts}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
                <View style={styles.post}>
                    <Text style={styles.postTitle}>{item.title}</Text>
                    <Text style={styles.postBody}>{item.body}</Text>

                    <Link href={`/(labs)/edit?id=${item.id}`} asChild>
                        <TouchableOpacity style={styles.editButton}>
                            <Text style={styles.editButtonText}>Edit</Text>
                        </TouchableOpacity>
                    </Link>

                    {currentUser?.id === 1 && (
                        <TouchableOpacity style={styles.deleteButton} onPress={() => deletepost(item.id)}>
                            <Text style={styles.deleteButtonText}>Delete</Text>
                        </TouchableOpacity>
                    )}
                </View>
            )}
        />
    );
}

const styles = StyleSheet.create({
    post: {
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: "#CCC",
    },
    postTitle: {
        fontSize: 18,
        fontWeight: "bold",
    },
    postBody: {
        fontSize: 14,
        color: "#666",
        marginTop: 8,
    },
    editButton: {
        marginTop: 8,
        backgroundColor: "#28A745",
        padding: 8,
        borderRadius: 5,
        alignSelf: "flex-start",
    },
    editButtonText: {
        color: "#FFF",
        fontSize: 14,
    },
    deleteButton: {
        marginTop: 8,
        backgroundColor: "#DC3545",
        padding: 8,
        borderRadius: 5,
        alignSelf: "flex-start",
    },
    deleteButtonText: {
        color: "#FFF",
        fontSize: 14,
    },
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    errorText: {
        color: 'red',
        fontSize: 16,
    },
});

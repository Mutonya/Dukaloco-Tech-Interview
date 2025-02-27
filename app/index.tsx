import { FlatList, Text, TouchableOpacity, View, StyleSheet } from "react-native";
import { useContext } from "react";
import { DukaContext } from "@/app/context/DukaContext";
import { Link } from "expo-router";

export default function Index() {
    const { blogPosts, deletepost, currentUser } = useContext(DukaContext);

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
});

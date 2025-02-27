import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: "#fff",
    },
    offlineContainer: {
        backgroundColor: "#ffcc00",
        padding: 10,
        borderRadius: 5,
        marginBottom: 16,
    },
    offlineText: {
        color: "#000",
        fontSize: 14,
    },
    card: {
        backgroundColor: "white",
        padding: 16,
        marginHorizontal: 16,
        marginVertical: 8,
        borderRadius: 8,
        elevation: 3,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    postTitle: {
        fontSize: 18,
        fontWeight: "bold",
        marginBottom: 6,
    },
    postBody: {
        fontSize: 14,
        color: "#666",
        marginBottom: 10,
    },
    actions: {
        flexDirection: "row",
        justifyContent: "space-between",
    },
    button: {
        backgroundColor: "#000",
        paddingVertical: 8,
        paddingHorizontal: 12,
        borderRadius: 5,
        alignItems: "center",
    },
    retryButton: {
        backgroundColor: '#007bff',
        padding: 10,
        borderRadius: 5,
    },
    retryButtonText: {
        color: '#fff',
        fontSize: 16,
    },
    buttonText: {
        color: "#FFF",
        fontSize: 14,
        fontWeight: "bold",
    },
    input: {
        borderWidth: 1,
        borderColor: "#ccc",
        borderRadius: 8,
        padding: 10,
        fontSize: 16,
        marginBottom: 10,
    },
    bodyInput: {
        height: "auto",
        textAlignVertical: "top",
    },
    loadingContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorContainer: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    errorText: {
        color: "red",
        fontSize: 16,
    },
    fab: {
        position: "absolute",
        right: 20,
        bottom: 20,
        backgroundColor: "#000",
        width: 56,
        height: 56,
        borderRadius: 28,
        justifyContent: "center",
        alignItems: "center",
        elevation: 4,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 3 },
        shadowOpacity: 0.3,
        shadowRadius: 4,
    },
});

export default styles;
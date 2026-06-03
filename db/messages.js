import { supabase } from "./client.js"

export async function getMessages(userFrom, userTo) {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq."${userFrom}",receiver_id.eq."${userTo}"),and(sender_id.eq."${userTo}",receiver_id.eq."${userFrom}")`)
        .order("created_at", { ascending: false })

    if (error) throw error
    return data
}

export async function getAllChatUsers(userId) {
    const { data, error } = await supabase
        .from("messages")
        .select("sender_id, receiver_id")
        .or(`sender_id.eq."${userId}",receiver_id.eq."${userId}"`);

    if (error) throw error;

    // Collect unique chat partners, excluding self
    const partners = new Set();
    for (const msg of data) {
        const other = msg.sender_id === userId ? msg.receiver_id : msg.sender_id;
        if (other !== userId) partners.add(other);
    }

    const ids = [...partners];
    if (ids.length === 0) return [];

    const { data: users, error: userError } = await supabase
        .from("users")
        .select("id, name, username")
        .in("id", ids);

    if (userError) throw userError;
    return users;
}

export async function sendMessage(senderId, receiverId, content) {
    const { data, error } = await supabase
        .from("messages")
        .insert([
            {
                sender_id: senderId,
                receiver_id: receiverId,
                content,
            },
        ])
        .select()

    if (error) throw error
    return data[0]
}
import { supabase } from "./client.js"

export async function getMessages(userFrom, userTo) {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq."${userFrom}",receiver_id.eq."${userTo}"),and(sender_id.eq."${userTo}",receiver_id.eq."${userFrom}")`)
        .order("created_at", { ascending: true })

    if (error) throw error
    return data
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
import { supabase } from "./client.js"

export async function getMessages(userA, userB) {
    const { data, error } = await supabase
        .from("messages")
        .select("*")
        .or(`and(sender_id.eq."${userA}",receiver_id.eq."${userB}"),and(sender_id.eq."${userB}",receiver_id.eq."${userA}")`)
        .order("created_at", { ascending: true })

    if (error) throw error
    return data
}

export async function sendMessage(senderId, recieverId, content) {
    const { data, error } = await supabase
        .from("messages")
        .insert([
            {
                sender_id: senderId,
                receiver_id: recieverId,
                content,
            },
        ])
        .select()

    if (error) throw error
    return data[0]
}
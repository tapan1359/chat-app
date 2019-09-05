const users = []

// addUser, removeUser, getUser, getUsersInRoom

const addUser = ({ id, username, room }) => {
    // Clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    // Validate data
    if (!username || !room) {
        return {
            error: 'Username and room are required!'
        }
    }

    // Check for existing user
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    // Validate username
    if (existingUser) {
        return {
            error: 'Username is taken!'
        }
    }

    // store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

addUser({
    id: 12,
    username: 'Tapan',
    room: 'City'
})

console.log(users)
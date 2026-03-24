import { createServer } from 'http'
import { Server, Socket } from 'socket.io'

const PORT = 3003

const httpServer = createServer()
const io = new Server(httpServer, {
  path: '/',
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  },
  pingTimeout: 60000,
  pingInterval: 25000,
  transports: ['websocket', 'polling']
})

console.log(`[RailBondhu] WebSocket server starting on port ${PORT}`)

// Types
interface TrainChatUser {
  id: string
  socketId: string
  displayName: string
  trainId: string
  isSharingLocation: boolean
}

interface TrainChatMessage {
  id: string
  trainId: string
  userId: string
  displayName: string
  message: string
  timestamp: Date
  type: 'user' | 'system'
}

interface LocationUpdate {
  trainId: string
  lat: number
  lng: number
  speed?: number
  heading?: number
  timestamp: string
  userId?: string
}

// Store users by socket id
const users = new Map<string, TrainChatUser>()

// Store users by train room
const trainRooms = new Map<string, Set<string>>()

// Store recent messages per train (last 50)
const trainMessages = new Map<string, TrainChatMessage[]>()

// Store latest locations per train
const trainLocations = new Map<string, LocationUpdate>()

const generateMessageId = () => `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`

const createSystemMessage = (trainId: string, content: string): TrainChatMessage => ({
  id: generateMessageId(),
  trainId,
  userId: 'system',
  displayName: 'System',
  message: content,
  timestamp: new Date(),
  type: 'system'
})

const createUserMessage = (trainId: string, userId: string, displayName: string, content: string): TrainChatMessage => ({
  id: generateMessageId(),
  trainId,
  userId,
  displayName,
  message: content,
  timestamp: new Date(),
  type: 'user'
})

// Store message in history
const storeMessage = (trainId: string, message: TrainChatMessage) => {
  if (!trainMessages.has(trainId)) {
    trainMessages.set(trainId, [])
  }
  const messages = trainMessages.get(trainId)!
  messages.push(message)
  // Keep only last 50 messages
  if (messages.length > 50) {
    messages.shift()
  }
}

// Get users in a train room
const getTrainUsers = (trainId: string): TrainChatUser[] => {
  const room = trainRooms.get(trainId)
  if (!room) return []
  return Array.from(room)
    .map(socketId => users.get(socketId))
    .filter((u): u is TrainChatUser => u !== undefined)
}

// Broadcast users list to a train room
const broadcastUsersList = (trainId: string) => {
  const roomUsers = getTrainUsers(trainId)
  io.to(trainId).emit('users-list', {
    trainId,
    users: roomUsers.map(u => ({ 
      id: u.id, 
      displayName: u.displayName,
      isSharingLocation: u.isSharingLocation
    })),
    count: roomUsers.length
  })
}

// Handle new connection
io.on('connection', (socket: Socket) => {
  console.log(`[${new Date().toISOString()}] User connected: ${socket.id}`)

  // ==================== CHAT EVENTS ====================

  // Join a train chat room
  socket.on('join-train-chat', (data: { trainId: string; userId: string; displayName: string }) => {
    const { trainId, userId, displayName } = data
    console.log(`[${new Date().toISOString()}] Join request: ${displayName} (${userId}) -> train ${trainId}`)

    // Leave any existing rooms
    const existingUser = users.get(socket.id)
    if (existingUser) {
      const existingRoom = trainRooms.get(existingUser.trainId)
      if (existingRoom) {
        existingRoom.delete(socket.id)
        socket.leave(existingUser.trainId)
        
        // Notify others in the previous room
        const leaveMessage = createSystemMessage(existingUser.trainId, `${existingUser.displayName} left the chat`)
        storeMessage(existingUser.trainId, leaveMessage)
        io.to(existingUser.trainId).emit('chat-message', leaveMessage)
        io.to(existingUser.trainId).emit('user-left', { 
          userId: existingUser.id, 
          displayName: existingUser.displayName 
        })
        broadcastUsersList(existingUser.trainId)
      }
    }

    // Create user object
    const user: TrainChatUser = {
      id: userId,
      socketId: socket.id,
      displayName: displayName || 'Anonymous',
      trainId,
      isSharingLocation: false
    }

    // Add to users map
    users.set(socket.id, user)

    // Add to train room
    if (!trainRooms.has(trainId)) {
      trainRooms.set(trainId, new Set())
    }
    trainRooms.get(trainId)!.add(socket.id)

    // Join the socket.io room
    socket.join(trainId)

    // Send chat history to the new user
    const recentMessages = trainMessages.get(trainId) || []
    socket.emit('chat-history', { 
      trainId, 
      messages: recentMessages.slice(-20) 
    })

    // Send latest location if available
    const latestLocation = trainLocations.get(trainId)
    if (latestLocation) {
      socket.emit('train-location-update', latestLocation)
    }

    // Send join notification to all users in the room
    const joinMessage = createSystemMessage(trainId, `${user.displayName} joined the chat`)
    storeMessage(trainId, joinMessage)
    io.to(trainId).emit('chat-message', joinMessage)
    
    // Notify others about new user
    io.to(trainId).emit('user-joined', { 
      userId: user.id, 
      displayName: user.displayName 
    })

    // Broadcast updated users list
    broadcastUsersList(trainId)

    const roomUsers = getTrainUsers(trainId)
    console.log(`[${new Date().toISOString()}] ${user.displayName} joined train ${trainId}, online: ${roomUsers.length}`)
  })

  // Leave a train chat room
  socket.on('leave-train-chat', (data: { trainId: string }) => {
    const user = users.get(socket.id)
    
    if (user && user.trainId === data.trainId) {
      // Remove from users map
      users.delete(socket.id)
      
      // Remove from train room
      const room = trainRooms.get(user.trainId)
      if (room) {
        room.delete(socket.id)
        
        // Clean up empty rooms
        if (room.size === 0) {
          trainRooms.delete(user.trainId)
          trainMessages.delete(user.trainId)
          trainLocations.delete(user.trainId)
        }
      }
      
      // Leave socket.io room
      socket.leave(user.trainId)
      
      // Notify others in the room
      const leaveMessage = createSystemMessage(user.trainId, `${user.displayName} left the chat`)
      storeMessage(user.trainId, leaveMessage)
      io.to(user.trainId).emit('chat-message', leaveMessage)
      io.to(user.trainId).emit('user-left', { 
        userId: user.id, 
        displayName: user.displayName 
      })
      broadcastUsersList(user.trainId)
      
      console.log(`[${new Date().toISOString()}] ${user.displayName} left train ${user.trainId}`)
    }
  })

  // Handle chat messages
  socket.on('send-message', (data: { trainId: string; message: string }) => {
    const user = users.get(socket.id)
    
    if (user && user.trainId === data.trainId) {
      const chatMessage = createUserMessage(
        data.trainId, 
        user.id, 
        user.displayName, 
        data.message
      )
      
      // Store message
      storeMessage(data.trainId, chatMessage)
      
      // Broadcast to all users in the train room
      io.to(data.trainId).emit('chat-message', chatMessage)
      
      console.log(`[${new Date().toISOString()}] [${data.trainId}] ${user.displayName}: ${data.message.substring(0, 50)}...`)
    }
  })

  // ==================== LOCATION EVENTS ====================

  // Handle location updates from users
  socket.on('location-update', (data: { trainId: string; lat: number; lng: number; speed?: number; heading?: number }) => {
    const user = users.get(socket.id)
    
    if (user && user.trainId === data.trainId) {
      // Mark user as sharing location
      user.isSharingLocation = true
      
      // Create location update
      const locationUpdate: LocationUpdate = {
        trainId: data.trainId,
        lat: data.lat,
        lng: data.lng,
        speed: data.speed,
        heading: data.heading,
        timestamp: new Date().toISOString(),
        userId: user.id
      }
      
      // Store latest location
      trainLocations.set(data.trainId, locationUpdate)
      
      // Broadcast location update to all users in the train room
      io.to(data.trainId).emit('train-location-update', locationUpdate)
      
      // Update users list to show who's sharing location
      broadcastUsersList(data.trainId)
      
      console.log(`[${new Date().toISOString()}] [${data.trainId}] Location update from ${user.displayName}: ${data.lat.toFixed(4)}, ${data.lng.toFixed(4)}`)
    }
  })

  // ==================== DISCONNECT ====================

  socket.on('disconnect', (reason) => {
    const user = users.get(socket.id)
    
    if (user) {
      // Remove from users map
      users.delete(socket.id)
      
      // Remove from train room
      const room = trainRooms.get(user.trainId)
      if (room) {
        room.delete(socket.id)
        
        // Clean up empty rooms
        if (room.size === 0) {
          trainRooms.delete(user.trainId)
          trainMessages.delete(user.trainId)
          trainLocations.delete(user.trainId)
        }
      }
      
      // Notify others in the room
      const leaveMessage = createSystemMessage(user.trainId, `${user.displayName} disconnected`)
      storeMessage(user.trainId, leaveMessage)
      io.to(user.trainId).emit('chat-message', leaveMessage)
      io.to(user.trainId).emit('user-left', { 
        userId: user.id, 
        displayName: user.displayName 
      })
      broadcastUsersList(user.trainId)
      
      console.log(`[${new Date().toISOString()}] ${user.displayName} disconnected from train ${user.trainId} (reason: ${reason})`)
    } else {
      console.log(`[${new Date().toISOString()}] User disconnected: ${socket.id} (reason: ${reason})`)
    }
  })

  // Handle errors
  socket.on('error', (error) => {
    console.error(`[${new Date().toISOString()}] Socket error (${socket.id}):`, error)
  })
})

httpServer.listen(PORT, () => {
  console.log(`[${new Date().toISOString()}] ✅ RailBondhu WebSocket server running on port ${PORT}`)
  console.log(`[${new Date().toISOString()}] Ready to accept connections`)
})

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('[Shutdown] Received SIGTERM signal, shutting down server...')
  io.close(() => {
    console.log('[Shutdown] WebSocket server closed')
    process.exit(0)
  })
})

process.on('SIGINT', () => {
  console.log('[Shutdown] Received SIGINT signal, shutting down server...')
  io.close(() => {
    console.log('[Shutdown] WebSocket server closed')
    process.exit(0)
  })
})

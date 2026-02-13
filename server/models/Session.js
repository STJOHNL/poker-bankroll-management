import mongoose from 'mongoose'

const sessionSchema = new mongoose.Schema(
  {
    type: String,
    game: String,
    blinds: String,
    buyin: Number,
    cashout: Number,
    venue: String,
    tableSize: Number,
    startTime: Date,
    endTime: Date,
    notes: String,
    expenses: Number,
    // Only for cash
    rebuys: Number,
    // Only for tournaments
    name: String,
    guarantee: String,
    startingStack: String,
    addons: Boolean,
    addonsCost: Number,
    bounties: Boolean,
    bountiesCollected: Number,
    totalPlayers: Number,
    finishPosition: Number
  },
  { timestamps: true }
)

const Session = mongoose.model('Session', sessionSchema)

export default Session

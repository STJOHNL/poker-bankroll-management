import Session from '../models/Session.js'

export default {
  // @desc Get Sessions
  // @route GET /api/session
  // @access PRIVATE
  getSessions: async (req, res, next) => {
    try {
      const sessions = await Session.find().sort({ createdDate: 1 })

      res.status(200).json(sessions)
    } catch (error) {
      console.log(error)
    }
  },

  // @desc Get Session By Id
  // @route GET /api/session/:id
  // @access PRIVATE
  getSessionById: async (req, res, next) => {
    try {
      const session = await Session.findById(req.params.id)

      res.status(200).json(session)
    } catch (error) {
      console.log(error)
    }
  },

  // @desc Create Session
  // @route POST /api/session
  // @access PRIVATE
  createSession: async (req, res, next) => {
    try {
      const { type, game, blinds, buyin, cashout, venue, tableSize, startTime, endTime, notes, expenses, rebuys, name, guarantee, startingStack, addons, addonsCost, bounties, bountiesCollected, totalPlayers, finishPosition } = req.body

      // Create session document
      const sessionObj = await Session.create({
        type,
        game,
        blinds,
        buyin,
        cashout,
        venue,
        tableSize,
        startTime,
        endTime,
        notes,
        expenses,
        rebuys,
        name,
        guarantee,
        startingStack,
        addons,
        addonsCost,
        bounties,
        bountiesCollected,
        totalPlayers,
        finishPosition
      })

      res.status(201).json(sessionObj)
    } catch (error) {
      console.log(error)
    }
  },

  // @desc Edit Session
  // @route PUT /api/session
  // @access PRIVATE
  editSession: async (req, res, next) => {
    try {
      const { id, type, game, blinds, buyin, cashout, venue, tableSize, startTime, endTime, notes, expenses, rebuys, name, guarantee, startingStack, addons, addonsCost, bounties, bountiesCollected, totalPlayers, finishPosition } = req.body

      // Update session document
      const updatedSession = await Session.findByIdAndUpdate(
        id,
        {
          type,
          game,
          blinds,
          buyin,
          cashout,
          venue,
          tableSize,
          startTime,
          endTime,
          notes,
          expenses,
          rebuys,
          name,
          guarantee,
          startingStack,
          addons,
          addonsCost,
          bounties,
          bountiesCollected,
          totalPlayers,
          finishPosition
        },
        {
          new: true
        }
      )

      res.status(200).json(updatedSession)
    } catch (error) {
      console.log(error)
    }
  },

  // @desc Delete Sessions
  // @route DELETE /api/session/:id
  // @access PRIVATE
  deleteSession: async (req, res, next) => {
    try {
      const deletedSession = await Session.findByIdAndDelete(req.params.id)

      res.status(200).json(deletedSession)
    } catch (error) {
      console.log(error)
    }
  },

  // @desc Import Sessions from CSV
  // @route POST /api/session/import
  // @access PRIVATE
  importSessions: async (req, res, next) => {
    try {
      const { sessions } = req.body
      if (!Array.isArray(sessions) || sessions.length === 0) {
        return res.status(400).json({ message: 'No sessions provided' })
      }

      const docs = sessions.map(s => ({
        type: 'cash',
        startTime: new Date(s.start),
        endTime: new Date(s.end),
        buyin: 0,
        cashout: parseFloat(s.profit),
        game: 'Imported',
      }))

      const inserted = await Session.insertMany(docs)
      res.status(201).json({ count: inserted.length, sessions: inserted })
    } catch (error) {
      console.log(error)
    }
  }
}
